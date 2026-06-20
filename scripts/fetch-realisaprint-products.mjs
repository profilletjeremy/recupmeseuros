#!/usr/bin/env node
/**
 * Probes the Realisaprint API with multiple call conventions to discover
 * which one returns the product catalog for shop 251.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/realisaprint-products.json');

const shop_id = process.env.REALISAPRINT_SHOP_ID;
const api_key = process.env.REALISAPRINT_API_KEY;

if (!shop_id || !api_key) {
  console.warn('Missing credentials — skipping.');
  process.exit(0);
}

async function probe(label, url, options = {}) {
  console.log(`\n--- ${label} ---`);
  console.log('URL:', url);
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    console.log(`Status: ${res.status}, body length: ${text.length}`);
    console.log('Body:', text.slice(0, 500) || '(empty)');
    return { status: res.status, text };
  } catch (e) {
    console.log('Error:', e.message);
    return null;
  }
}

const BASE = 'https://www.realisaprint.com/api/';
const creds = { shop_id, api_key };

// Try 1: POST to /api/ with function=products (form-encoded)
await probe('POST /api/ function=products (form-encoded)', BASE, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ ...creds, function: 'products' }).toString(),
});

// Try 2: GET to /api/?function=products
await probe('GET /api/?function=products', `${BASE}?${new URLSearchParams({ ...creds, function: 'products' })}`);

// Try 3: GET to /api/products
await probe('GET /api/products', `${BASE}products?${new URLSearchParams(creds)}`);

// Try 4: POST to /api/ with action=products
await probe('POST /api/ action=products', BASE, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ ...creds, action: 'products' }).toString(),
});

// Try 5: GET to /api/get_products
await probe('GET /api/get_products', `${BASE}get_products?${new URLSearchParams(creds)}`);

// Try 6: POST JSON body
await probe('POST /api/ JSON body', BASE, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...creds, function: 'products' }),
});

// Try 7: the prescript URL pattern (GET /api/get_prescript)
await probe('GET /api/get_prescript (without iframe)', `${BASE}get_prescript?${new URLSearchParams({ ...creds, function: 'products' })}`);

// Try 8: base URL with no trailing slash
await probe('POST https://www.realisaprint.com/api', 'https://www.realisaprint.com/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ ...creds, function: 'products' }).toString(),
});

console.log('\nAll probes done. Check output above to see which format returns data.');
