#!/usr/bin/env node
/**
 * Slow, rate-limit-respecting crawler that captures, for every Realisaprint
 * product, a valid stock id and a real product image, then writes:
 *   - public/product-previews/<slug>.<ext>   (the downloaded images)
 *   - src/data/product-images.json            ({ id: { slug, name, stock, image } })
 *
 * The Realisaprint API enforces a ~1-request-per-15-second global rate limit,
 * so this is intentionally slow (~40 min for the full catalog). It is meant to
 * run occasionally via the crawl-images workflow, NOT on every deploy. Its
 * committed output is consumed by the fast build-time catalog builder.
 *
 * Env: REALISAPRINT_SHOP_ID, REALISAPRINT_API_KEY
 *      CRAWL_LIMIT (optional) — cap number of products (for testing)
 *      CRAWL_INTERVAL_MS (optional) — override pacing (default 15500)
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

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
const LIMIT = process.env.CRAWL_LIMIT ? Number(process.env.CRAWL_LIMIT) : Infinity;
const PERMISSIVE = !!process.env.CRAWL_PERMISSIVE;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Global pacing: ensure ≥ INTERVAL between consecutive rate-limited API calls.
let lastCall = 0;
async function paced() {
  const wait = INTERVAL - (Date.now() - lastCall);
  if (wait > 0) await sleep(wait);
  lastCall = Date.now();
}

function isRateLimited(body) {
  return body.length < 300 && /secondes|trop de requêtes|too many/i.test(body);
}

async function apiPost(endpoint, params = {}) {
  await paced();
  const body = new URLSearchParams({ shop_id, api_key, ...params });
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const text = await res.text();
    if (isRateLimited(text)) { await sleep(INTERVAL); lastCall = Date.now(); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status} from /api/${endpoint}`);
    return JSON.parse(text);
  }
  throw new Error(`rate-limited after retries: ${endpoint}`);
}

async function fetchPrescript(productId, stock) {
  await paced();
  const params = new URLSearchParams({ shop_id, api_key_encoded, product: productId, stock, margin: '0', country: 'GP' });
  const url = `${BASE}get_prescript?iframe&${params.toString()}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': ORIGIN + '/' } });
    const text = await res.text();
    if (isRateLimited(text)) { await sleep(INTERVAL); lastCall = Date.now(); continue; }
    if (!res.ok) throw new Error(`prescript HTTP ${res.status}`);
    return text;
  }
  throw new Error('prescript rate-limited after retries');
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[®©™°]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function parseStock(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const dig = (obj) => {
    if (obj.stocks) return dig(obj.stocks);
    if (obj.configurations) return dig(obj.configurations);
    if (Array.isArray(obj)) {
      const first = obj[0];
      if (first && typeof first === 'object') return String(first.id ?? first.stock ?? first.code ?? '');
      return null;
    }
    const keys = Object.keys(obj);
    if (!keys.length) return null;
    // { "<stockId>": <label-or-object> }
    const k = keys[0];
    const v = obj[k];
    if (v && typeof v === 'object' && v.id) return String(v.id);
    return String(k);
  };
  if (raw.error) return null;
  const s = dig(raw);
  return s && s !== 'error' && s !== 'stocks' ? s : null;
}

const IMG_EXCLUDE = /logo|sprite|favicon|pixel|blank|spacer|placeholder|loader|spinner|charte|nouveau_site|icone|picto|ajax/i;
const IMG_EXT = /\.(jpe?g|png|webp)(\?|$)/i;

function absolutize(url) {
  if (!url) return null;
  url = url.trim().replace(/&amp;/g, '&');
  if (url.startsWith('data:')) return null;
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return ORIGIN + url;
  return ORIGIN + '/' + url;
}

function extractImages(html) {
  const out = new Set();
  const push = (u) => { const a = absolutize(u); if (a) out.add(a); };
  for (const m of html.matchAll(/<img[^>]+(?:data-(?:src|original)|src)=["']([^"']+)["']/gi)) push(m[1]);
  for (const m of html.matchAll(/<img[^>]+srcset=["']([^"']+)["']/gi)) {
    for (const part of m[1].split(',')) { const u = part.trim().split(/\s+/)[0]; if (u) push(u); }
  }
  for (const m of html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi)) push(m[1]);
  for (const m of html.matchAll(/background(?:-image)?\s*:\s*url\(["']?([^"')]+)["']?\)/gi)) push(m[1]);
  // JSON-embedded image keys (JS variables, config payloads)
  for (const m of html.matchAll(/"(?:src|url|image|thumbnail|visuel|preview|apercu)"\s*:\s*"([^"]+)"/gi)) push(m[1]);
  // JS assignments like src = "..." or image: '...'
  for (const m of html.matchAll(/\b(?:src|image)\s*[:=]\s*["']([^"']+\.(?:jpe?g|png|webp)[^"']*)["']/gi)) push(m[1]);
  return [...out];
}

function score(url, slug) {
  if (IMG_EXCLUDE.test(url)) return -100;
  let s = 0;
  if (!IMG_EXT.test(url)) s -= 5;
  if (/media\.obiprint\.com\/images\//i.test(url)) s += 30;
  if (slug && url.toLowerCase().includes(slug.split('-')[0])) s += 8;
  if (/preview|visuel|produit|impression|personnalise/i.test(url)) s += 6;
  if (/\.webp/i.test(url)) s += 4;
  if (/\.(jpe?g|png)/i.test(url)) s += 2;
  return s;
}

function pickImage(candidates, slug, permissive = false) {
  // In permissive mode accept any non-excluded image (score > -100); normal mode requires score > 0.
  const threshold = permissive ? -100 : 0;
  const ranked = candidates.map((u) => ({ u, s: score(u, slug) })).filter((c) => c.s > threshold).sort((a, b) => b.s - a.s);
  return ranked.length ? ranked[0].u : null;
}

async function downloadImage(url, destBase) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': ORIGIN + '/' } });
  if (!res.ok) throw new Error(`img HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(`not an image (${ct})`);
  const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) throw new Error(`too small (${buf.length}b)`);
  const dest = `${destBase}.${ext}`;
  writeFileSync(dest, buf);
  return `${IMG_PUBLIC_PREFIX}/${dest.split('/').pop()}`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log(`Crawling product images (interval ${INTERVAL}ms)…`);
mkdirSync(IMG_DIR, { recursive: true });

// Resume from any existing map so partial runs are not lost.
let map = { generatedAt: null, products: {} };
if (existsSync(MAP_OUT)) {
  try { map = JSON.parse(readFileSync(MAP_OUT, 'utf-8')); } catch { /* ignore */ }
}
map.products = map.products ?? {};

const products = await apiPost('products');
const entries = Object.entries(products?.products ?? {}).slice(0, LIMIT);
console.log(`Got ${entries.length} products to crawl`);

let done = 0, images = 0;
for (const [id, name] of entries) {
  const slug = slugify(String(name));
  done++;
  // Skip products already captured with an image.
  if (map.products[id]?.image) { images++; continue; }

  try {
    const cfg = await apiPost('configurations', { product: id });
    const stock = parseStock(cfg);
    if (!stock) { console.warn(`  [${done}/${entries.length}] ${name}: no valid stock`); continue; }

    let image = null;
    try {
      const html = await fetchPrescript(id, stock);
      const best = pickImage(extractImages(html), slug, PERMISSIVE);
      if (best) image = await downloadImage(best, `${IMG_DIR}/${slug}`);
    } catch (err) {
      console.warn(`  [${done}/${entries.length}] ${name}: image failed (${err.message})`);
    }

    map.products[id] = { slug, name: String(name), stock, ...(image ? { image } : {}) };
    if (image) { images++; console.log(`  [${done}/${entries.length}] ✓ ${slug} stock=${stock} ${image}`); }
    else console.log(`  [${done}/${entries.length}] ~ ${slug} stock=${stock} (no image)`);
  } catch (err) {
    console.warn(`  [${done}/${entries.length}] ${name}: ${err.message}`);
  }

  // Persist progress incrementally so a timeout still leaves usable data.
  map.generatedAt = new Date().toISOString();
  mkdirSync(dirname(MAP_OUT), { recursive: true });
  writeFileSync(MAP_OUT, JSON.stringify(map, null, 2), 'utf-8');
}

console.log(`✓ Crawl complete: ${images} images across ${Object.keys(map.products).length} products`);
