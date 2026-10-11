import { randomUUID, timingSafeEqual } from 'node:crypto';

const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const json = (body, status = 200) => Response.json(body, { status, headers });
const clean = value => typeof value === 'string' ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim() : '';
const validId = value => typeof value === 'string' && /^\d{13}-[a-f0-9-]{36}$/.test(value);

// A separate key for every note prevents visitors' simultaneous posts overwriting each other.
export function createNotesHandler(store, password = '4321') {
  return async request => {
    const method = request.method;
    if (!['GET', 'POST', 'DELETE'].includes(method)) return json({ error: 'method' }, 405);
    if (method !== 'GET') {
      const origin = request.headers.get('origin');
      if (origin && origin !== new URL(request.url).origin) return json({ error: 'origin' }, 403);
      if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'format' }, 415);
    }
    try {
      if (method === 'GET') {
        const keys = [];
        for await (const page of store.list({ prefix: 'notes/', paginate: true })) {
          keys.push(...page.blobs.map(blob => blob.key));
        }
        keys.sort(); // Inverted timestamp keys put the newest notes first.
        const notes = (await Promise.all(keys.slice(0, 100).map(key => store.get(key, { type: 'json' })))).filter(Boolean);
        return json({ notes });
      }
      // Read a bounded body instead of trusting a caller's Content-Length header.
      const reader = request.body?.getReader();
      if (!reader) return json({ error: 'format' }, 400);
      const decoder = new TextDecoder(); let body = ''; let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 4096) { await reader.cancel(); return json({ error: 'length' }, 413); }
        body += decoder.decode(value, { stream: true });
      }
      body += decoder.decode();
      let data;
      try { data = JSON.parse(body); } catch (_) { return json({ error: 'format' }, 400); }
      if (!data || typeof data !== 'object') return json({ error: 'format' }, 400);
      if (method === 'POST') {
        const message = clean(data.message), name = clean(data.name);
        if (!message || message.length > 280 || name.length > 32) return json({ error: 'length' }, 400);
        const id = `${String(9999999999999 - Date.now()).padStart(13, '0')}-${randomUUID()}`;
        const note = { id, message, name, color: ['yellow', 'peach', 'blue'].includes(data.color) ? data.color : 'yellow', createdAt: new Date().toISOString() };
        await store.setJSON('notes/' + id, note);
        return json({ note }, 201);
      }
      const supplied = Buffer.from(typeof data.password === 'string' ? data.password : '');
      const expected = Buffer.from(password);
      if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return json({ error: 'password' }, 403);
      if (!validId(data.id)) return json({ error: 'id' }, 400);
      const key = 'notes/' + data.id;
      if (!await store.get(key, { type: 'json' })) return json({ error: 'missing' }, 404);
      await store.delete(key);
      return json({ deleted: true });
    } catch (_) {
      return json({ error: 'unavailable' }, 503);
    }
  };
}
