'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) });
    const payload = await response.json(); setLoading(false);
    if (!response.ok) return setError(payload.error ?? 'Não foi possível entrar.');
    router.refresh();
  }

  return <main className="cms-login">
    <section className="cms-login__visual"><div className="cms-login__orb" /><Image src="/images/produtos-reais/kit-30x44-rosa-perspectiva.png" alt="Produto Mundo Encantado" width={520} height={650} priority /><div><span>CMS MUNDO ENCANTADO</span><h1>Seu universo,<br />sempre bem cuidado.</h1><p>Conteúdo, imagens e contatos comerciais em um único lugar.</p></div></section>
    <section className="cms-login__form"><div className="cms-login__card"><img src="/logo_mundo_encantado_dark.svg" alt="Mundo Encantado" /><p className="cms-kicker">ACESSO PROTEGIDO</p><h2>Bem-vindo de volta</h2><p>Entre com suas credenciais administrativas.</p><form onSubmit={submit}><label>E-mail<input name="email" type="email" autoComplete="username" required autoFocus /></label><label>Senha<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="cms-error" role="alert">{error}</p>}<button type="submit" disabled={loading}>{loading ? 'Entrando…' : 'Acessar painel'}<span>→</span></button></form><small>Sessão segura com duração de 8 horas.</small></div></section>
  </main>;
}
