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
  console.error('Missing REALISAPRINT_SHOP_ID or REALISAPRINT_API_KEY');
  process.exit(1);
}

async function call(fn, extra = {}) {
  const body = new URLSearchParams({ shop_id, api_key, function: fn, ...extra });
  const res = await fetch('https://www.realisaprint.com/api/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response: ${text.slice(0, 200)}`);
  }
}

console.log('Fetching products from Realisaprint API...');
const data = await call('products');

console.log('Raw API response:');
console.log(JSON.stringify(data, null, 2));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(data, null, 2));
console.log(`\nSaved to ${OUT}`);
