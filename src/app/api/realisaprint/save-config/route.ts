import { saveConfiguration } from '@/lib/realisaprint';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { configurationId: string; variables: Record<string, string> };
    const { configurationId, variables } = body;
    if (!configurationId || !variables) {
      return Response.json({ error: 'Missing configurationId or variables' }, { status: 400 });
    }
    const data = await saveConfiguration(configurationId, variables);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
