import { getPrice } from '@/lib/realisaprint';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const quantity = searchParams.get('quantity');
  if (!code || !quantity) {
    return Response.json({ error: 'Missing code or quantity parameter' }, { status: 400 });
  }
  try {
    const data = await getPrice(code, quantity);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
