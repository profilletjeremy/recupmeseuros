import { getOrder } from '@/lib/realisaprint';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const order = searchParams.get('order');
  if (!order) return Response.json({ error: 'Missing order parameter' }, { status: 400 });
  try {
    const data = await getOrder(order);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
