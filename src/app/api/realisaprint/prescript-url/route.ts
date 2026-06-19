import { getPrescriptIframeUrl } from '@/lib/realisaprint';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product = searchParams.get('product');
  const stock = searchParams.get('stock');
  const country = searchParams.get('country') ?? 'GP';
  if (!product || !stock) {
    return Response.json({ error: 'Missing product or stock parameter' }, { status: 400 });
  }
  try {
    const url = getPrescriptIframeUrl(product, stock, country);
    return Response.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
