import crypto from 'crypto';

const BASE_URL = 'https://www.realisaprint.com/api/';

function credentials() {
  const shop_id = process.env.REALISAPRINT_SHOP_ID;
  const api_key = process.env.REALISAPRINT_API_KEY;
  if (!shop_id || !api_key) throw new Error('Missing Realisaprint credentials in environment variables');
  return { shop_id, api_key };
}

// Each function has its own endpoint: POST /api/<function>
async function rpPost(endpoint: string, params: Record<string, string> = {}): Promise<unknown> {
  const { shop_id, api_key } = credentials();
  const body = new URLSearchParams({ shop_id, api_key, ...params });
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Realisaprint HTTP error: ${res.status}`);
  return res.json();
}

export async function getProducts() {
  return rpPost('products');
}

export async function getConfigurations(productId: string) {
  return rpPost('configurations', { product: productId });
}

export async function showVariables(configurationId: string) {
  return rpPost('show_variables', { configuration: configurationId });
}

export async function saveConfiguration(
  configurationId: string,
  variables: Record<string, string>
) {
  const variableParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(variables)) {
    variableParams[`variables[${key}]`] = value;
  }
  return rpPost('save_configuration', { configuration: configurationId, ...variableParams });
}

export async function getPrice(code: string, quantity: string) {
  return rpPost('get_price', { code, qty: quantity });
}

export async function getConfigDetails(code: string) {
  return rpPost('config_details', { code });
}

export async function createOrder(
  code: string,
  quantity: string,
  address: {
    firstname: string;
    lastname: string;
    company?: string;
    address1: string;
    address2?: string;
    postcode: string;
    city: string;
    country: string;
    phone: string;
    email: string;
  }
) {
  return rpPost('create_order', {
    code,
    qty: quantity,
    firstname: address.firstname,
    lastname: address.lastname,
    company: address.company ?? '',
    address1: address.address1,
    address2: address.address2 ?? '',
    postcode: address.postcode,
    city: address.city,
    country: address.country,
    phone: address.phone,
    email: address.email,
  });
}

export async function getOrder(orderId: string) {
  return rpPost('get_order', { order: orderId });
}

export async function getIsoCountries() {
  return rpPost('get_iso_countries');
}

/**
 * Builds the Préscript iFrame URL for the product configurator.
 * The api_key_encoded is the MD5 hash of the API key — safe to include in client-visible URLs.
 * The raw api_key is never sent to the client.
 *
 * `margin` is the reseller markup applied by Préscript on top of the raw API price:
 * displayed price = base price × (1 + margin). margin=0 shows the raw API price; the
 * previous margin=1 doubled every price. Override with REALISAPRINT_MARGIN to apply a
 * real reseller margin (e.g. '0.3' for +30%) without a code change.
 */
export function getPrescriptIframeUrl(
  realisaprintProductId: string,
  realisaprintStock: string,
  country = 'GP'
): string {
  const { shop_id, api_key } = credentials();
  const api_key_encoded = crypto.createHash('md5').update(api_key).digest('hex');
  const margin = process.env.REALISAPRINT_MARGIN ?? '0';
  const params = new URLSearchParams({
    shop_id,
    api_key_encoded,
    product: realisaprintProductId,
    stock: realisaprintStock,
    margin,
    country,
  });
  return `${BASE_URL}get_prescript?iframe&${params.toString()}`;
}
