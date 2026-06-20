#!/usr/bin/env node
/**
 * Browser-based image crawler (fallback for products the plain-HTTP crawler
 * could not capture). It loads each product's Préscript configurator in a real
 * headless Chromium, waits for the preview gallery to render, then downloads the
 * main product image from *inside* the page context — so the request carries the
 * right session/referer and is not blocked with HTTP 403 like the bare fetch was.
 *
 * Only processes products in src/data/product-images.json that still have a
 * `stock` id but no `image`. Writes the downloaded files to
 * public/product-previews/ and updates the map in place.
 *
 * Env: REALISAPRINT_SHOP_ID, REALISAPRINT_API_KEY
 *      CRAWL_INTERVAL_MS (optional) — pacing between products (default 15500)
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMG_DIR = resolve(__dirname, '../public/product-previews');
const IMG_PUBLIC_PREFIX = '/product-previews';
const MAP_OUT = resolve(__dirname, '../src/data/product-images.json');

const shop_id = process.env.REALISAPRINT_SHOP_ID;
const api_key = process.env.REALISAPRINT_API_KEY;
if (!shop_id || !api_key) {
  console.error('Missing REALISAPRINT credentials.');
  process.exit(1);
}

const BASE = 'https://www.realisaprint.com/api/';
const ORIGIN = 'https://www.realisaprint.com';
const api_key_encoded = crypto.createHash('md5').update(api_key).digest('hex');
const INTERVAL = Number(process.env.CRAWL_INTERVAL_MS || 15500);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function prescriptUrl(productId, stock) {
  const params = new URLSearchParams({ shop_id, api_key_encoded, product: productId, stock, margin: '0', country: 'GP' });
  return `${BASE}get_prescript?iframe&${params.toString()}`;
}

const IMG_EXCLUDE = /logo|sprite|favicon|pixel|blank|spacer|placeholder|loader|spinner|charte|nouveau_site|icone|picto|ajax|youtube|play/i;

// Picks the most likely product preview image among the rendered <img> elements:
// largest rendered area, on the obiprint CDN, not an excluded asset.
function pickFromRendered(images) {
  const ranked = images
    .filter((im) => im.src && !IMG_EXCLUDE.test(im.src))
    .map((im) => {
      let s = im.w * im.h;
      if (/media\.obiprint\.com\/images\//i.test(im.src)) s += 1_000_000;
      if (/preview|visuel|produit|impression|personnalise/i.test(im.src)) s += 500_000;
      return { src: im.src, s };
    })
    .sort((a, b) => b.s - a.s);
  return ranked.length ? ranked[0].src : null;
}

async function run() {
  mkdirSync(IMG_DIR, { recursive: true });
  let map = { generatedAt: null, products: {} };
  if (existsSync(MAP_OUT)) {
    try { map = JSON.parse(readFileSync(MAP_OUT, 'utf-8')); } catch { /* ignore */ }
  }
  map.products = map.products ?? {};

  const missing = Object.entries(map.products).filter(([, p]) => p.stock && !p.image);
  console.log(`Browser crawl for ${missing.length} products without image (interval ${INTERVAL}ms)…`);

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
    extraHTTPHeaders: { Referer: ORIGIN + '/' },
  });

  let captured = 0;
  let idx = 0;
  for (const [id, prod] of missing) {
    idx++;
    const slug = prod.slug;
    const page = await context.newPage();
    try {
      await page.goto(prescriptUrl(id, String(prod.stock)), { waitUntil: 'networkidle', timeout: 45000 });
      // Give the configurator a moment to lazy-load the gallery.
      await page.waitForTimeout(2500);

      const images = await page.evaluate(() =>
        Array.from(document.images).map((im) => ({
          src: im.currentSrc || im.src,
          w: im.naturalWidth || im.width,
          h: im.naturalHeight || im.height,
        }))
      );
      const best = pickFromRendered(images);
      if (!best) {
        console.warn(`  [${idx}/${missing.length}] ${prod.name}: no rendered image found`);
        continue;
      }

      // Download from inside the page context (correct session/referer → no 403).
      const data = await page.evaluate(async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const buf = await res.arrayBuffer();
        const ct = res.headers.get('content-type') || '';
        let bin = '';
        const bytes = new Uint8Array(buf);
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return { b64: btoa(bin), ct };
      }, best);

      if (!data.ct.startsWith('image/')) {
        console.warn(`  [${idx}/${missing.length}] ${prod.name}: not an image (${data.ct})`);
        continue;
      }
      const ext = data.ct.includes('png') ? 'png' : data.ct.includes('webp') ? 'webp' : 'jpg';
      const buf = Buffer.from(data.b64, 'base64');
      if (buf.length < 1024) {
        console.warn(`  [${idx}/${missing.length}] ${prod.name}: too small (${buf.length}b)`);
        continue;
      }
      const dest = `${IMG_DIR}/${slug}.${ext}`;
      writeFileSync(dest, buf);
      prod.image = `${IMG_PUBLIC_PREFIX}/${slug}.${ext}`;
      captured++;
      console.log(`  [${idx}/${missing.length}] ✓ ${slug} ${prod.image} (${buf.length}b)`);
    } catch (err) {
      console.warn(`  [${idx}/${missing.length}] ${prod.name}: ${err.message}`);
    } finally {
      await page.close();
      map.generatedAt = new Date().toISOString();
      writeFileSync(MAP_OUT, JSON.stringify(map, null, 2), 'utf-8');
      if (idx < missing.length) await sleep(INTERVAL);
    }
  }

  await browser.close();
  console.log(`✓ Browser crawl complete: captured ${captured}/${missing.length} new images`);
}

run().catch((err) => { console.error(err); process.exit(1); });
