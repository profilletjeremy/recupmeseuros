#!/usr/bin/env node
/**
 * Fetches the Realisaprint product catalog + configurations and saves
 * them to src/data/realisaprint-catalog.json for use at build time.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/realisaprint-catalog.json');

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
  [/set de table/i, '🍽️'],
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

function parseConfigurations(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((c) => {
      if (typeof c === 'object' && c !== null) {
        return { id: String(c.id ?? c.stock ?? c.code ?? ''), name: String(c.name ?? c.label ?? c.nom ?? '') };
      }
      return null;
    }).filter(Boolean);
  }
  if (typeof raw === 'object') {
    // Could be { "id1": "name1", ... } or { configurations: [...] }
    if (raw.configurations) return parseConfigurations(raw.configurations);
    return Object.entries(raw).map(([id, name]) => ({ id, name: String(name) }));
  }
  return [];
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log('Fetching Realisaprint product catalog…');

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

for (const [id, name] of productEntries) {
  const slug = slugify(String(name));
  const { category, categoryLabel } = categorize(String(name));
  const emoji = getEmoji(String(name));

  let configurations = [];
  try {
    const raw = await rpPost('configurations', { product: id });
    console.log(`  [${id}] ${name} → configs: ${JSON.stringify(raw).slice(0, 150)}`);
    configurations = parseConfigurations(raw);
  } catch (err) {
    console.warn(`  ⚠ No configs for ${id} (${name}): ${err.message}`);
  }

  catalog.products[id] = { id, name: String(name), slug, category, categoryLabel, emoji, configurations };
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(catalog, null, 2), 'utf-8');
console.log(`✓ Catalog saved: ${Object.keys(catalog.products).length} products`);
