import { NextResponse } from 'next/server';
import { audit, readCms, writeCms } from '@/lib/cms/store';

type Customer = { name?: unknown; company?: unknown; email?: unknown; phone?: unknown; consent?: unknown };
type QuoteItem = { product?: { id?: string }; quantity?: number };

const clean = (value: unknown, limit = 300) => String(value ?? '').trim().slice(0, limit);
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null) as { customer?: Customer; items?: QuoteItem[] } | null;
  const name = clean(payload?.customer?.name);
  const company = clean(payload?.customer?.company);
  const email = clean(payload?.customer?.email).toLowerCase();
  const phone = clean(payload?.customer?.phone);
  const requestedItems = Array.isArray(payload?.items) ? payload.items.slice(0, 50) : [];

  if (!name || !company || !email || !phone || payload?.customer?.consent !== 'accepted' || !requestedItems.length || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Dados obrigatórios inválidos.' }, { status: 400 });
  }

  const cms = await readCms();
  const items = requestedItems.map((item) => {
    const product = cms.products.find((entry) => entry.id === clean(item.product?.id) && entry.active !== false);
    const quantity = Number(item.quantity);
    if (!product || !Number.isFinite(quantity) || quantity < product.minOrder) return null;
    return { product: { name: product.name, shortName: product.shortName }, quantity };
  });
  if (items.some((item) => item === null)) {
    return NextResponse.json({ ok: false, error: 'Produtos ou quantidades inválidos.' }, { status: 400 });
  }
  const validItems = items.filter((item): item is NonNullable<typeof item> => item !== null);
  const submissionId = crypto.randomUUID();
  const quoteId = `GG-${new Date().getFullYear()}-${submissionId.slice(0, 6).toUpperCase()}`;
  cms.submissions.unshift({ id: submissionId, form: 'orcamento', data: { nome: name, empresa: company, email, whatsapp: phone, orcamento: quoteId, itens: JSON.stringify(validItems) }, status: 'new', createdAt: new Date().toISOString() });
  cms.audit.unshift(audit('create', `submission:${submissionId}`));
  await writeCms(cms);

  const itemRows = validItems.map((item) => {
    const productName = escapeHtml(clean(item.product?.name || item.product?.shortName));
    return `<tr><td style="padding:10px;border-bottom:1px solid #eee">${productName}</td><td style="padding:10px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td></tr>`;
  }).join('');
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.QUOTES_FROM_EMAIL;
  if (!apiKey || !from) return NextResponse.json({ ok: false, error: 'Serviço de e-mail não configurado.' }, { status: 503 });

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: email,
      subject: `Seu orçamento Mundo Encantado — ${quoteId}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#171217"><h1 style="color:#64237a">Olá, ${escapeHtml(name)}!</h1><p>Recebemos o orçamento da <strong>${escapeHtml(company)}</strong>. Nosso time continuará o atendimento pelo WhatsApp.</p><p><strong>Orçamento ${quoteId}</strong></p><table style="width:100%;border-collapse:collapse"><thead><tr><th style="padding:10px;text-align:left">Produto</th><th style="padding:10px">Qtd.</th></tr></thead><tbody>${itemRows}</tbody></table><p style="color:#6f6670;font-size:13px">Estoque e condições comerciais serão confirmados durante o atendimento.</p></div>`,
    }),
  });
  if (!emailResponse.ok) return NextResponse.json({ ok: false, error: 'Não foi possível enviar o e-mail.' }, { status: 502 });

  const itemMessage = validItems.map((item) => `• ${clean(item.product.shortName || item.product.name)} — ${item.quantity} un.`).join('\n');
  const message = `Olá! Sou ${name}, da empresa ${company}. Gerei o orçamento ${quoteId} no site e gostaria de continuar o atendimento.\n\n${itemMessage}\n\nE-mail: ${email}`;
  const salesPhone = (process.env.SALES_WHATSAPP || '').replace(/\D/g, '');
  const whatsappUrl = salesPhone ? `https://wa.me/${salesPhone}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
  return NextResponse.json({ ok: true, id: quoteId, whatsappUrl }, { status: 201 });
}
