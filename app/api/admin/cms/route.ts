import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/cms/auth';
import { audit, readCms, writeCms } from '@/lib/cms/store';
import type { ContentEntry, ContentStatus, ContentType, FormSubmission, MediaItem } from '@/lib/cms/types';
import type { Product } from '@/lib/data';

async function authorized() { return await isAdmin(); }
const forbidden = () => NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

export async function GET() {
  if (!await authorized()) return forbidden();
  return NextResponse.json(await readCms(), { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!await authorized()) return forbidden();
  const body = await request.json();
  const cms = await readCms();
  if (body.resource === 'content') {
    const key = String(body.key ?? '').trim();
    if (!key || cms.content.some((item) => item.key === key)) return NextResponse.json({ error: 'Chave inválida ou já existente.' }, { status: 400 });
    const item: ContentEntry = { id: crypto.randomUUID(), key, group: String(body.group ?? 'Geral'), label: String(body.label ?? key), type: (body.type ?? 'text') as ContentType, value: String(body.value ?? ''), status: (body.status ?? 'draft') as ContentStatus, updatedAt: new Date().toISOString() };
    cms.content.push(item); cms.audit.unshift(audit('create', `content:${item.key}`)); await writeCms(cms);
    return NextResponse.json(item, { status: 201 });
  }
  if (body.resource === 'product') {
    if (!body.name || !body.sku || !body.slug || !body.image || !Array.isArray(body.tiers) || !body.tiers.length || cms.products.some(item => item.sku === body.sku || item.slug === body.slug)) return NextResponse.json({ error: 'Preencha os dados obrigatórios e use SKU e endereço únicos.' }, { status: 400 });
    const item: Product = { id:crypto.randomUUID(),slug:String(body.slug),name:String(body.name),shortName:String(body.shortName||body.name),category:String(body.category||'Kits para presente'),description:String(body.description||''),image:String(body.image||''),sku:String(body.sku),minOrder:Number(body.minOrder||1),unit:String(body.unit||'un.'),stock:Number(body.stock||0),featured:Boolean(body.featured),active:body.active !== false,tags:Array.isArray(body.tags)?body.tags:[],specifications:Array.isArray(body.specifications)?body.specifications:[],tiers:Array.isArray(body.tiers)?body.tiers:[] };
    cms.products.push(item); cms.audit.unshift(audit('create', `product:${item.sku}`)); await writeCms(cms); return NextResponse.json(item, { status: 201 });
  }
  return NextResponse.json({ error: 'Recurso inválido.' }, { status: 400 });
}

export async function PATCH(request: Request) {
  if (!await authorized()) return forbidden();
  const body = await request.json();
  const cms = await readCms();
  if (body.resource === 'content') {
    const index = cms.content.findIndex((item) => item.id === body.id);
    if (index < 0) return NextResponse.json({ error: 'Conteúdo não encontrado.' }, { status: 404 });
    cms.content[index] = { ...cms.content[index], label: String(body.label ?? cms.content[index].label), group: String(body.group ?? cms.content[index].group), value: String(body.value ?? cms.content[index].value), type: (body.type ?? cms.content[index].type) as ContentType, status: (body.status ?? cms.content[index].status) as ContentStatus, updatedAt: new Date().toISOString() };
    cms.audit.unshift(audit('update', `content:${cms.content[index].key}`)); await writeCms(cms); return NextResponse.json(cms.content[index]);
  }
  if (body.resource === 'submission') {
    const item = cms.submissions.find((entry) => entry.id === body.id) as FormSubmission | undefined;
    if (!item) return NextResponse.json({ error: 'Contato não encontrado.' }, { status: 404 });
    item.status = body.status; cms.audit.unshift(audit('update', `submission:${item.id}`)); await writeCms(cms); return NextResponse.json(item);
  }
  if (body.resource === 'product') {
    const index = cms.products.findIndex(item => item.id === body.id); if (index < 0) return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    if (cms.products.some((item, itemIndex) => itemIndex !== index && (item.sku === body.sku || item.slug === body.slug))) return NextResponse.json({ error: 'SKU ou endereço já utilizado por outro produto.' }, { status: 400 });
    const { resource: _resource, id: _id, ...changes } = body; cms.products[index] = { ...cms.products[index], ...changes, id:cms.products[index].id } as Product; cms.audit.unshift(audit('update', `product:${cms.products[index].sku}`)); await writeCms(cms); return NextResponse.json(cms.products[index]);
  }
  if (body.resource === 'media') {
    const item = cms.media.find((entry) => entry.id === body.id) as MediaItem | undefined;
    if (!item) return NextResponse.json({ error: 'Mídia não encontrada.' }, { status: 404 });
    item.name = String(body.name ?? item.name); item.alt = String(body.alt ?? item.alt); cms.audit.unshift(audit('update', `media:${item.id}`)); await writeCms(cms); return NextResponse.json(item);
  }
  return NextResponse.json({ error: 'Recurso inválido.' }, { status: 400 });
}

export async function DELETE(request: Request) {
  if (!await authorized()) return forbidden();
  const { resource, id } = await request.json();
  const cms = await readCms();
  if (resource === 'content') cms.content = cms.content.filter((item) => item.id !== id);
  else if (resource === 'product') cms.products = cms.products.filter((item) => item.id !== id);
  else if (resource === 'submission') cms.submissions = cms.submissions.filter((item) => item.id !== id);
  else if (resource === 'media') {
    const item = cms.media.find((entry) => entry.id === id);
    if (item && (cms.content.some((entry) => entry.value === item.url) || cms.products.some((product) => product.image === item.url))) return NextResponse.json({ error: 'Esta imagem está em uso no site ou no catálogo.' }, { status: 409 });
    cms.media = cms.media.filter((entry) => entry.id !== id);
    if (item?.url.startsWith('/uploads/')) await fs.unlink(path.join(process.cwd(), 'public', item.url.replace(/^\/+/, ''))).catch(() => null);
    else if (item?.url.includes('/site-media/') && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const filename = item.url.split('/site-media/').pop();
      if (filename) await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } }).storage.from('site-media').remove([filename]);
    }
  } else return NextResponse.json({ error: 'Recurso inválido.' }, { status: 400 });
  cms.audit.unshift(audit('delete', `${resource}:${id}`)); await writeCms(cms); return NextResponse.json({ ok: true });
}
