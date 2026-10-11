import { getStore } from '@netlify/blobs';
import { createNotesHandler } from '../../lib/notes-handler.mjs';

export default async (request, context) => {
  try {
    const deployContext = context?.deploy?.context || process.env.CONTEXT || 'production';
    // Preview notes never overwrite the production wall.
    const name = deployContext === 'production' ? 'portfolio-visitor-notes' : 'portfolio-visitor-notes-preview';
    const store = getStore({ name, consistency: 'strong' });
    return await createNotesHandler(store, process.env.WALL_DELETE_PASSWORD || '4321')(request);
  } catch (_) {
    return Response.json({ error: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};

export const config = {
  path: '/api/notes',
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] }
};
