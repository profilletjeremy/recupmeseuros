#!/usr/bin/env node
/**
 * Fetches the Realisaprint product catalog + configurations and saves
 * them to src/data/realisaprint-catalog.json for use at build time.
 *
 * Also attempts to retrieve a real product preview image from the
 * Préscript configurator for each product and downloads it into
 * public/product-previews/<slug>.<ext>. When an image is captured, its
 * path is stored on the catalog product as `image`; otherwise the UI
 * falls back to the SVG mockups.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/realisaprint-catalog.json');
const IMG_DIR = resolve(__dirname, '../public/product-previews');
const IMG_PUBLIC_PREFIX = '/product-previews';

const shop_id = process.env.REALISAPRINT_SHOP_ID;
const api_key = process.env.REALISAPRINT_API_KEY;

if (!shop_id || !api_key) {
  console.warn('Missing REALISAPRINT credentials — skipping catalog fetch.');
  process.exit(0);
}

const BASE = 'https://www.realisaprint.com/api/';
const ORIGIN = 'https://www.realisaprint.com';
const api_key_encoded = crypto.createHash('md5').update(api_key).digest('hex');

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
    if (raw.configurations) return parseConfigurations(raw.configurations);
    return Object.entries(raw).map(([id, name]) => ({ id, name: String(name) }));
  }
  return [];
}

// ── Image discovery ─────────────────────────────────────────────────────────

function absolutize(url) {
  if (!url) return null;
  url = url.trim().replace(/&amp;/g, '&');
  if (url.startsWith('data:')) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return ORIGIN + url;
  return ORIGIN + '/' + url;
}

const IMG_EXCLUDE = /logo|sprite|icon|favicon|pixel|blank|spacer|placeholder|flag-|drapeau-fr|loader|spinner/i;
const IMG_EXT = /\.(jpe?g|png|webp)(\?|$)/i;

function extractImageCandidates(html) {
  const candidates = new Set();
  const push = (u) => { const a = absolutize(u); if (a) candidates.add(a); };

  // og:image / twitter:image
  for (const m of html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi)) push(m[1]);
  // <img src>
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) push(m[1]);
  // data-src / lazy loading
  for (const m of html.matchAll(/<img[^>]+data-(?:src|original)=["']([^"']+)["']/gi)) push(m[1]);
  // css background-image url(...)
  for (const m of html.matchAll(/background(?:-image)?\s*:\s*url\(["']?([^"')]+)["']?\)/gi)) push(m[1]);

  return [...candidates];
}

function scoreCandidate(url) {
  let score = 0;
  if (IMG_EXCLUDE.test(url)) return -100;
  if (!IMG_EXT.test(url)) score -= 5;
  if (/og[-_]?image|preview|visuel|product|produit|apercu|thumb|upload|media|template|model/i.test(url)) score += 10;
  if (/realisaprint/i.test(url)) score += 3;
  if (/\.(jpe?g|png|webp)/i.test(url)) score += 3;
  return score;
}

function pickBestImage(candidates) {
  const ranked = candidates
    .map((u) => ({ u, s: scoreCandidate(u) }))
    .filter((c) => c.s > -50)
    .sort((a, b) => b.s - a.s);
  return ranked.length ? ranked[0].u : null;
}

async function fetchPrescriptHtml(productId, stock) {
  const params = new URLSearchParams({
    shop_id, api_key_encoded, product: productId, stock, margin: '1', country: 'GP',
  });
  const url = `${BASE}get_prescript?iframe&${params.toString()}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (catalog-builder)' } });
  if (!res.ok) throw new Error(`prescript HTTP ${res.status}`);
  return res.text();
}

async function downloadImage(url, destBase) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (catalog-builder)' } });
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

mkdirSync(IMG_DIR, { recursive: true });
const catalog = { fetchedAt: new Date().toISOString(), products: {} };

// ── One-time image-source probe ──────────────────────────────────────────────
// The Préscript iframe renders client-side, so HTTP fetch may return an empty
// stub. Probe several endpoint variants once, dumping raw bodies, so we can see
// what is actually fetchable before committing to a strategy.
async function probeImageSources(sampleId, sampleStock, sampleName) {
  const sampleSlug = slugify(String(sampleName));
  console.log(`\n===== IMAGE PROBE for [${sampleId}] ${sampleName} (stock ${sampleStock}) =====`);

  const tries = [
    ['get_prescript?iframe (POST-style url)', `${BASE}get_prescript?iframe&shop_id=${shop_id}&api_key_encoded=${api_key_encoded}&product=${sampleId}&stock=${sampleStock}&margin=1&country=GP`],
    ['get_prescript (no iframe)', `${BASE}get_prescript?shop_id=${shop_id}&api_key_encoded=${api_key_encoded}&product=${sampleId}&stock=${sampleStock}&margin=1&country=GP`],
    ['public product page (slug.html)', `${ORIGIN}/${sampleSlug}.html`],
    ['public product page (impression-slug.html)', `${ORIGIN}/impression-${sampleSlug}.html`],
    ['site homepage', `${ORIGIN}/`],
  ];

  for (const [label, url] of tries) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': ORIGIN + '/' } });
      const body = await res.text();
      const candidates = extractImageCandidates(body);
      console.log(`  • ${label}`);
      console.log(`    -> ${url}`);
      console.log(`    status=${res.status} ct=${res.headers.get('content-type')} bytes=${body.length}`);
      console.log(`    body[0:200]=${JSON.stringify(body.slice(0, 200))}`);
      console.log(`    imageCandidates(${candidates.length}): ${candidates.slice(0, 6).join(' | ') || '(none)'}`);
    } catch (err) {
      console.log(`  • ${label} -> ${url}\n    ERROR ${err.message}`);
    }
  }
  console.log('===== END IMAGE PROBE =====\n');
}

let imageCount = 0;
let probed = false;

for (const [id, name] of productEntries) {
  const slug = slugify(String(name));
  const { category, categoryLabel } = categorize(String(name));
  const emoji = getEmoji(String(name));

  let configurations = [];
  try {
    const raw = await rpPost('configurations', { product: id });
    configurations = parseConfigurations(raw);
  } catch (err) {
    console.warn(`  ⚠ No configs for ${id} (${name}): ${err.message}`);
  }

  // Run the image-source probe once, on the first product that has a stock.
  const stock = configurations[0]?.id;
  if (!probed && stock) {
    probed = true;
    try { await probeImageSources(id, stock, name); } catch (err) { console.warn('probe failed:', err.message); }
  }

  catalog.products[id] = { id, name: String(name), slug, category, categoryLabel, emoji, configurations };
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(catalog, null, 2), 'utf-8');
console.log(`✓ Catalog saved: ${Object.keys(catalog.products).length} products, ${imageCount} with preview images`);
