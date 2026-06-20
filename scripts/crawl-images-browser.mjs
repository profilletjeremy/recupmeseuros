#!/usr/bin/env node
/**
 * Browser-based image crawler (fallback for products the plain-HTTP crawler
 * could not capture). It loads each product's Préscript configurator in a real
 * headless Chromium and captures the preview image by intercepting the network
 * image responses the browser downloads — this works even when the image lives
 * in a nested frame or is drawn onto a <canvas>, which a DOM `document.images`
 * scan misses. Falls back to a screenshot of the largest <canvas>/preview box.
 *
 * Only processes products in src/data/product-images.json that still have a
 * `stock` id but no `image`. Writes files to public/product-previews/ and
 * updates the map in place.
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

const IMG_EXCLUDE = /logo|sprite|favicon|pixel|blank|spacer|placeholder|loader|spinner|charte|nouveau_site|icone|picto|ajax|youtube|drapeau-fr|flag|\/flags?\//i;

function prescriptUrl(productId, stock) {
  const params = new URLSearchParams({ shop_id, api_key_encoded, product: productId, stock, margin: '0', country: 'GP' });
  return `${BASE}get_prescript?iframe&${params.toString()}`;
}

function scoreUrl(url) {
  let s = 0;
  if (/media\.obiprint\.com\/images\//i.test(url)) s += 1_000_000;
  if (/preview|visuel|produit|impression|personnalise|mockup/i.test(url)) s += 200_000;
  if (/\.webp(\?|$)/i.test(url)) s += 5_000;
  return s;
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
    viewport: { width: 1280, height: 1000 },
    extraHTTPHeaders: { Referer: ORIGIN + '/' },
  });

  let captured = 0;
  let idx = 0;
  for (const [id, prod] of missing) {
    idx++;
    const slug = prod.slug;
    const page = await context.newPage();

    // Collect every image the browser downloads, with its decoded bytes.
    const candidates = []; // { url, buf, score, size }
    page.on('response', async (res) => {
      try {
        const ct = res.headers()['content-type'] || '';
        if (!ct.startsWith('image/')) return;
        const url = res.url();
        if (IMG_EXCLUDE.test(url)) return;
        const buf = await res.body().catch(() => null);
        if (!buf || buf.length < 2048) return; // skip tiny icons
        candidates.push({ url, buf, ct, score: scoreUrl(url) + buf.length, size: buf.length });
      } catch { /* ignore */ }
    });

    try {
      await page.goto(prescriptUrl(id, String(prod.stock)), { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(3000); // let the gallery/canvas settle

      let chosen = candidates.sort((a, b) => b.score - a.score)[0] || null;

      if (chosen) {
        const ext = chosen.ct.includes('png') ? 'png' : chosen.ct.includes('webp') ? 'webp' : chosen.ct.includes('jpeg') || chosen.ct.includes('jpg') ? 'jpg' : 'jpg';
        const dest = `${IMG_DIR}/${slug}.${ext}`;
        writeFileSync(dest, chosen.buf);
        prod.image = `${IMG_PUBLIC_PREFIX}/${slug}.${ext}`;
        captured++;
        console.log(`  [${idx}/${missing.length}] ✓ ${slug} ← ${chosen.url.split('/').pop()} (${chosen.size}b)`);
      } else {
        // Fallback: screenshot the largest <canvas>/<img> preview box in any frame.
        let shot = null;
        for (const frame of page.frames()) {
          try {
            const handle = await frame.evaluateHandle(() => {
              const els = [...document.querySelectorAll('canvas, img')];
              let best = null, area = 0;
              for (const el of els) {
                const r = el.getBoundingClientRect();
                if (r.width * r.height > area && r.width > 150 && r.height > 150) { area = r.width * r.height; best = el; }
              }
              return best;
            });
            const el = handle.asElement();
            if (el) { shot = await el.screenshot({ type: 'png' }).catch(() => null); if (shot) break; }
          } catch { /* ignore */ }
        }
        if (shot && shot.length > 2048) {
          const dest = `${IMG_DIR}/${slug}.png`;
          writeFileSync(dest, shot);
          prod.image = `${IMG_PUBLIC_PREFIX}/${slug}.png`;
          captured++;
          console.log(`  [${idx}/${missing.length}] ✓ ${slug} (screenshot ${shot.length}b)`);
        } else {
          console.warn(`  [${idx}/${missing.length}] ${prod.name}: no image found (${candidates.length} img responses seen)`);
        }
      }
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
