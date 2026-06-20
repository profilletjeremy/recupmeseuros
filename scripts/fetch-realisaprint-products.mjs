#!/usr/bin/env node
/**
 * Build-time catalog builder (fast path).
 *
 * Fetches the Realisaprint product list (names) — a single API call — and
 * merges committed crawl data from src/data/product-images.json (produced by
 * scripts/crawl-product-images.mjs) to attach a valid stock id and a real
 * product image to each product. The result is written to
 * src/data/realisaprint-catalog.json.
 *
 * Per-product `configurations` / Préscript calls are intentionally NOT made
 * here: the Realisaprint API enforces a ~1-request-per-15-seconds rate limit,
 * which makes per-build crawling impractical. That heavy work lives in the
 * separate, manually-run crawl workflow whose output is committed to the repo.
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/realisaprint-catalog.json');
const IMAGES_MAP = resolve(__dirname, '../src/data/product-images.json');

const shop_id = process.env.REALISAPRINT_SHOP_ID;
const api_key = process.env.REALISAPRINT_API_KEY;

if (!shop_id || !api_key) {
  console.warn('Missing REALISAPRINT credentials — skipping catalog fetch.');
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

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[®©™°]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const CATEGORY_MAP = [
  [/beachflag|arche|roll-up|kakémono|stand/i, 'evenementiel', 'Événementiel'],
  [/affiche|poster|enseigne|panneau|akilux|forex|alupanel|tole|tablette|carton plume|alvéolaire|display|drapeau|banderole|papier peint|toile/i, 'affichage', 'Affichage'],
  [/flyer|tract|dépliant|brochure|carte de visite|carte postale|papier entête|mailing|impression unitaire/i, 'communication', 'Communication'],
  [/liasse|carnet|autocopiant|pochette|enveloppe|billet|ticket|tampon|ruban|note adhésive|set de table|sous-mains|étiquette/i, 'papeterie', 'Papeterie'],
  [/coffret|gobelet|packaging|boîte/i, 'packaging', 'Packaging'],
  [/usb|clé|tapis de souris|mug|t-shirt|tee|stylo|carte musicale|calendrier|sous-mains/i, 'goodies', 'Goodies'],
];

const EMOJI_MAP = [
  [/affiche|poster/i, '🎨'],
  [/autocollant|sticker|adhésif|étiquette/i, '🏷️'],
  [/clé usb|usb/i, '💾'],
  [/drapeau/i, '🚩'],
  [/banderole/i, '🚩'],
  [/beachflag|arche/i, '🏖️'],
  [/flyer|tract/i, '📋'],
  [/gobelet/i, '🥤'],
  [/tampon/i, '📮'],
  [/mug/i, '☕'],
  [/carte de visite/i, '🪪'],
  [/carte postale|carte musicale/i, '💌'],
  [/brochure|dépliant/i, '📚'],
  [/tapis de souris/i, '🖱️'],
  [/tapis/i, '🟥'],
  [/billet|ticket/i, '🎫'],
  [/papier entête|papeterie/i, '📄'],
  [/liasse|carnet|autocopiant/i, '📋'],
  [/pochette/i, '📁'],
  [/calendrier/i, '📅'],
  [/note adhésive/i, '📝'],
  [/enseigne|panneau/i, '🪧'],
  [/coffret/i, '🎁'],
  [/display/i, '🖥️'],
  [/sous-mains/i, '🗂️'],
  [/papier peint/i, '🎨'],
  [/toile/i, '🖼️'],
  [/set de table/i, '🍽️'],
  [/ruban/i, '🎀'],
  [/roll-up|kakémono/i, '📌'],
  [/t-shirt|tee/i, '👕'],
  [/akilux|forex|alupanel|alvéolaire/i, '🪟'],
  [/impression unitaire/i, '🖨️'],
  [/dispositif|protection/i, '🛡️'],
];

function categorize(name) {
  for (const [pattern, cat, label] of CATEGORY_MAP) {
    if (pattern.test(name)) return { category: cat, categoryLabel: label };
  }
  return { category: 'communication', categoryLabel: 'Communication' };
}

function getEmoji(name) {
  for (const [pattern, emoji] of EMOJI_MAP) {
    if (pattern.test(name)) return emoji;
  }
  return '🖨️';
}

// ── Committed crawl data (stock ids + images) ────────────────────────────────
let crawlData = { products: {} };
if (existsSync(IMAGES_MAP)) {
  try {
    crawlData = JSON.parse(readFileSync(IMAGES_MAP, 'utf-8'));
  } catch {
    console.warn('Could not parse product-images.json — proceeding without it.');
  }
}
const crawlProducts = crawlData.products ?? {};

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('Fetching Realisaprint product list…');

let productsResponse;
try {
  productsResponse = await rpPost('products');
} catch (err) {
  console.error('Failed to fetch products:', err.message);
  process.exit(1);
}

const rawProducts = productsResponse?.products ?? {};
const productEntries = Object.entries(rawProducts);
console.log(`Got ${productEntries.length} products`);

const catalog = { fetchedAt: new Date().toISOString(), products: {} };
let withImage = 0;
let withStock = 0;

for (const [id, name] of productEntries) {
  const slug = slugify(String(name));
  const { category, categoryLabel } = categorize(String(name));
  const emoji = getEmoji(String(name));

  // Merge crawl data: valid stock id + real product image.
  const crawl = crawlProducts[id] ?? {};
  const configurations = crawl.stock
    ? [{ id: String(crawl.stock), name: 'Configuration standard' }]
    : [];
  if (crawl.stock) withStock++;
  if (crawl.image) withImage++;

  catalog.products[id] = {
    id,
    name: String(name),
    slug,
    category,
    categoryLabel,
    emoji,
    configurations,
    ...(crawl.image ? { image: crawl.image } : {}),
  };
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(catalog, null, 2), 'utf-8');
console.log(`✓ Catalog saved: ${Object.keys(catalog.products).length} products (${withStock} with stock id, ${withImage} with image)`);
