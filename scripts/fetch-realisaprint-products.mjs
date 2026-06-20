#!/usr/bin/env node
/**
 * Fetches the product catalog from the Realisaprint API and writes it to
 * src/data/realisaprint-products.json so Next.js can import it at build time.
 *
 * Run: node scripts/fetch-realisaprint-products.mjs
 * Requires: REALISAPRINT_SHOP_ID and REALISAPRINT_API_KEY env vars.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/realisaprint-products.json');

const shop_id = process.env.REALISAPRINT_SHOP_ID;
const api_key = process.env.REALISAPRINT_API_KEY;

if (!shop_id || !api_key) {
  console.warn('⚠ Missing REALISAPRINT_SHOP_ID or REALISAPRINT_API_KEY — skipping API fetch, using existing product data.');
  process.exit(0);
}

async function call(fn, extra = {}) {
  const body = new URLSearchParams({ shop_id, api_key, function: fn, ...extra });
  const res = await fetch('https://www.realisaprint.com/api/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const text = await res.text();
  console.log(`HTTP ${res.status} — response length: ${text.length} chars`);
  console.log('Raw response:', text.slice(0, 2000) || '(empty)');
  if (!res.ok) {
    console.warn(`HTTP error ${res.status} — skipping`);
    return null;
  }
  if (!text.trim()) {
    console.warn('Empty response from API — skipping');
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    console.warn(`Non-JSON response — skipping`);
    return null;
  }
}

console.log('Fetching products from Realisaprint API (function=products)...');
const data = await call('products');

if (!data) {
  console.log('No data returned — trying function=getProducts...');
  const data2 = await call('getProducts');
  if (!data2) {
    console.log('No data from either call. Skipping.');
    process.exit(0);
  }
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(data2, null, 2));
  console.log(`Saved to ${OUT}`);
  process.exit(0);
}

console.log('Full API response:');
console.log(JSON.stringify(data, null, 2));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(data, null, 2));
console.log(`Saved to ${OUT}`);
