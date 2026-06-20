#!/usr/bin/env node
/**
 * Fetches the Realisaprint product catalog and saves it to src/data/realisaprint-products.json.
 * The API expects POST requests to /api/<function> with shop_id and api_key in the form body.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/realisaprint-products.json');

const shop_id = process.env.REALISAPRINT_SHOP_ID;
const api_key = process.env.REALISAPRINT_API_KEY;

if (!shop_id || !api_key) {
  console.warn('Missing REALISAPRINT_SHOP_ID or REALISAPRINT_API_KEY — skipping product fetch.');
  process.exit(0);
}

const BASE = 'https://www.realisaprint.com/api/';

async function rpPost(endpoint, params = {}) {
  const body = new URLSearchParams({ shop_id, api_key, ...params });
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from /api/${endpoint}`);
  const text = await res.text();
  if (!text.trim()) throw new Error(`Empty response from /api/${endpoint}`);
  return JSON.parse(text);
}

console.log('Fetching Realisaprint product catalog…');

let products;
try {
  products = await rpPost('products');
} catch (err) {
  console.error('Failed to fetch products:', err.message);
  process.exit(1);
}

console.log('Products response:', JSON.stringify(products, null, 2).slice(0, 1000));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(products, null, 2), 'utf-8');
console.log(`Saved to ${OUT}`);
