import { NextResponse } from 'next/server';
import { audit, readCms, writeCms } from '@/lib/cms/store';
import type { FormSubmission } from '@/lib/cms/types';

const allowedForms = new Set(['contato', 'contato-corporativo', 'revendedor', 'download', 'cadastro']);
const requiredFields: Record<string, string[]> = {
  contato: ['nome', 'email', 'whatsapp', 'mensagem'],
  'contato-corporativo': ['nome', 'empresa', 'email', 'mensagem'],
  revendedor: ['nome', 'whatsapp', 'email', 'cnpj', 'cidade', 'estado', 'segmento'],
  download: ['nome', 'whatsapp', 'email', 'empresa'],
  cadastro: ['nivelCadastro', 'responsavel', 'email', 'telefone', 'consentimento'],
};

const completeRegistrationFields = ['razaoSocial', 'cnpj', 'nomeFantasia', 'inscricaoEstadual', 'segmento', 'cep', 'endereco', 'numero', 'bairro', 'cidade', 'estado', 'cargo'];

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null) as { form?: string; data?: Record<string, unknown> } | null;
  if (!payload?.form || !allowedForms.has(payload.form) || !payload.data) {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }
  const values = Object.fromEntries(Object.entries(payload.data).slice(0, 30).map(([key, value]) => [key.slice(0, 80), String(value).slice(0, 2000)]));
  if (!Object.keys(values).length) return NextResponse.json({ error: 'Formulário vazio.' }, { status: 400 });
  const required = [...(requiredFields[payload.form] ?? [])];
  if (payload.form === 'cadastro' && !['basico', 'completo'].includes(values.nivelCadastro)) {
    return NextResponse.json({ error: 'Nível de cadastro inválido.' }, { status: 400 });
  }
  if (payload.form === 'cadastro' && values.consentimento !== 'aceito') {
    return NextResponse.json({ error: 'Confirme o consentimento para concluir o cadastro.' }, { status: 400 });
  }
  if (payload.form === 'cadastro' && values.nivelCadastro === 'completo') required.push(...completeRegistrationFields);
  const email = String(values.email ?? '').trim();
  if (required.some((field) => !String(values[field] ?? '').trim()) || (required.includes('email') && !/^\S+@\S+\.\S+$/.test(email))) {
    return NextResponse.json({ error: 'Preencha corretamente todos os campos obrigatórios.' }, { status: 400 });
  }
  const cms = await readCms();
  const submission: FormSubmission = { id: crypto.randomUUID(), form: payload.form, data: values, status: 'new', createdAt: new Date().toISOString() };
  cms.submissions.unshift(submission);
  cms.audit.unshift(audit('create', `submission:${submission.id}`));
  await writeCms(cms);
  const response = NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
  if (payload.form === 'cadastro' && values.nivelCadastro === 'completo') {
    response.cookies.set('cadastro_b2b_completo', 'sim', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
  }
  return response;
}
