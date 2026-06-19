import { getConfigurations } from '@/lib/realisaprint';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product = searchParams.get('product');
  if (!product) return Response.json({ error: 'Missing product parameter' }, { status: 400 });
  try {
    const data = await getConfigurations(product);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
