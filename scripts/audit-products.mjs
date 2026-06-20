#!/usr/bin/env node
/**
 * Audit helper: fetches the Realisaprint `products` list (a single API call)
 * and compares it against the committed crawl map (src/data/product-images.json)
 * to surface (a) the true product count exposed by the API, (b) any products
 * the API returns that we have NOT captured, and (c) captured products missing
 * a real image. Read the output from the workflow logs.
 *
 * Env: REALISAPRINT_SHOP_ID, REALISAPRINT_API_KEY
 */

import { readFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAP = resolve(__dirname, '../src/data/product-images.json');

const shop_id = process.env.REALISAPRINT_SHOP_ID;
const api_key = process.env.REALISAPRINT_API_KEY;
if (!shop_id || !api_key) {
  console.error('Missing REALISAPRINT credentials.');
  process.exit(1);
}

const res = await fetch('https://www.realisaprint.com/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ shop_id, api_key }).toString(),
});
const text = await res.text();
console.log(`HTTP ${res.status} — ${text.length} bytes`);
if (!res.ok) { console.error(text.slice(0, 500)); process.exit(1); }

const raw = JSON.parse(text);
console.log('Top-level keys:', Object.keys(raw).join(', '));

const products = raw?.products ?? {};
const apiIds = Object.keys(products);
console.log(`\n=== API returns ${apiIds.length} products ===`);

// Full id → name dump (sorted numerically) so we can eyeball the catalog.
const sorted = apiIds.map((id) => [id, products[id]]).sort((a, b) => Number(a[0]) - Number(b[0]));
for (const [id, name] of sorted) console.log(`  ${id}\t${name}`);

// Compare to committed crawl map.
let map = { products: {} };
if (existsSync(MAP)) { try { map = JSON.parse(readFileSync(MAP, 'utf-8')); } catch { /* ignore */ } }
const captured = map.products ?? {};
const capturedIds = new Set(Object.keys(captured));

const missing = apiIds.filter((id) => !capturedIds.has(id));
const stale = [...capturedIds].filter((id) => !apiIds.includes(id));
const noImage = apiIds.filter((id) => capturedIds.has(id) && !captured[id]?.image);
const noStock = apiIds.filter((id) => capturedIds.has(id) && !captured[id]?.stock);

console.log(`\n=== Captured map has ${capturedIds.size} products ===`);
console.log(`\nMISSING from our map (in API, not captured): ${missing.length}`);
for (const id of missing) console.log(`  + ${id}\t${products[id]}`);
console.log(`\nSTALE in our map (captured, no longer in API): ${stale.length}`);
for (const id of stale) console.log(`  - ${id}\t${captured[id]?.name}`);
console.log(`\nCaptured but NO IMAGE: ${noImage.length}`);
for (const id of noImage) console.log(`  ~ ${id}\t${products[id]}`);
console.log(`\nCaptured but NO STOCK id: ${noStock.length}`);
for (const id of noStock) console.log(`  ! ${id}\t${products[id]}`);

console.log(`\nSUMMARY: api=${apiIds.length} captured=${capturedIds.size} missing=${missing.length} stale=${stale.length} noImage=${noImage.length} noStock=${noStock.length}`);
