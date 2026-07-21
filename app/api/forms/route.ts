import { NextResponse } from 'next/server';
import { audit, readCms, writeCms } from '@/lib/cms/store';
import type { FormSubmission } from '@/lib/cms/types';

const allowedForms = new Set(['contato', 'contato-corporativo', 'revendedor', 'download', 'cadastro', 'orcamento']);

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null) as { form?: string; data?: Record<string, unknown> } | null;
  if (!payload?.form || !allowedForms.has(payload.form) || !payload.data) {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }
  const values = Object.fromEntries(Object.entries(payload.data).slice(0, 30).map(([key, value]) => [key.slice(0, 80), String(value).slice(0, 2000)]));
  if (!Object.keys(values).length) return NextResponse.json({ error: 'Formulário vazio.' }, { status: 400 });
  const cms = await readCms();
  const submission: FormSubmission = { id: crypto.randomUUID(), form: payload.form, data: values, status: 'new', createdAt: new Date().toISOString() };
  cms.submissions.unshift(submission);
  cms.audit.unshift(audit('create', `submission:${submission.id}`));
  await writeCms(cms);
  const response = NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
  if (payload.form === 'download') {
    response.cookies.set('catalogo_liberado', 'sim', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
  }
  return response;
}
