import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/cms/auth';
import { audit, readCms, writeCms } from '@/lib/cms/store';
import type { MediaItem } from '@/lib/cms/types';

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  const data = await request.formData(); const file = data.get('file');
  if (!(file instanceof File) || !file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Envie uma imagem de até 8 MB.' }, { status: 400 });
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'webp';
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer()); let url = `/uploads/${filename}`;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const uploaded = await db.storage.from('site-media').upload(filename, buffer, { contentType: file.type, upsert: false });
    if (uploaded.error) return NextResponse.json({ error: uploaded.error.message }, { status: 502 });
    url = db.storage.from('site-media').getPublicUrl(filename).data.publicUrl;
  } else { const directory = path.join(process.cwd(), 'public', 'uploads'); await fs.mkdir(directory, { recursive: true }); await fs.writeFile(path.join(directory, filename), buffer); }
  const cms = await readCms(); const item: MediaItem = { id: crypto.randomUUID(), name: String(data.get('name') || file.name), alt: String(data.get('alt') || ''), url, createdAt: new Date().toISOString() };
  cms.media.unshift(item); cms.audit.unshift(audit('upload', `media:${item.id}`)); await writeCms(cms);
  return NextResponse.json(item, { status: 201 });
}
