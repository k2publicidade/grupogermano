import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import type { AuditEvent, CmsDocument } from './types';

const dataPath = path.join(process.cwd(), 'data', 'cms.json');

async function readLocal(): Promise<CmsDocument> {
  return JSON.parse(await fs.readFile(dataPath, 'utf8')) as CmsDocument;
}

function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}

export async function readCms(): Promise<CmsDocument> {
  const db = database();
  if (!db) return readLocal();
  const [contentResult, mediaResult, productsResult, submissionsResult, auditResult] = await Promise.all([
    db.from('cms_content').select('*').order('section'), db.from('media_library').select('*').order('created_at', { ascending: false }),
    db.from('cms_products').select('*').order('sort_order'),
    db.from('form_submissions').select('*').order('created_at', { ascending: false }), db.from('cms_audit_log').select('*').order('created_at', { ascending: false }).limit(250),
  ]);
  const error = contentResult.error ?? mediaResult.error ?? productsResult.error ?? submissionsResult.error ?? auditResult.error;
  if (error) throw new Error(`Falha ao ler o CMS: ${error.message}`);
  if (!contentResult.data?.length) { const seed = await readLocal(); const result = await db.rpc('replace_cms_document', { p_document: seed }); if (result.error) throw new Error(result.error.message); return seed; }
  return {
    content: contentResult.data.map(item => ({ id:item.id,key:item.key,group:item.section,label:item.label,type:item.content_type,value:item.value,status:item.status,updatedAt:item.updated_at })),
    media: (mediaResult.data ?? []).map(item => ({ id:item.id,name:item.name,url:item.storage_path,alt:item.alt_text,width:item.width, height:item.height,createdAt:item.created_at })),
    products: (productsResult.data ?? []).map(item => item.data),
    submissions: (submissionsResult.data ?? []).map(item => ({ id:item.id,form:item.form_key,data:item.payload,status:item.status,createdAt:item.created_at })),
    audit: (auditResult.data ?? []).map(item => ({ id:item.id,action:item.action,resource:item.resource,createdAt:item.created_at })),
  } as CmsDocument;
}

export async function writeCms(document: CmsDocument) {
  const db = database();
  if (db) { const result = await db.rpc('replace_cms_document', { p_document: document }); if (result.error) throw new Error(`Falha ao salvar o CMS: ${result.error.message}`); return; }
  const temporary = `${dataPath}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(document, null, 2), 'utf8');
  await fs.rename(temporary, dataPath);
}

export function audit(action: string, resource: string): AuditEvent {
  return { id: crypto.randomUUID(), action, resource, createdAt: new Date().toISOString() };
}
