import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { id, token } = body;

    if (!id) return Response.json({ error: 'ID requerido' }, { status: 400 });

    // Try by codigo first (SUP-2026-XXXX format)
    let quote = null;
    try {
      const results = await base44.asServiceRole.entities.Quote.filter({ codigo: id });
      quote = results && results.length > 0 ? results[0] : null;
    } catch (e) {}

    // Fallback to UUID
    if (!quote) {
      try {
        quote = await base44.asServiceRole.entities.Quote.get(id);
      } catch (e) {}
    }

    if (!quote) return Response.json({ error: 'Consulta no encontrada' }, { status: 404 });

    return Response.json({ quote });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});