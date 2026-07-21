'use client';

import { FormEvent, useState } from 'react';
import { ArrowIcon } from '@/components/icons';

export function HoldingContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending'); setError('');
    const form = event.currentTarget;
    const response = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ form: 'contato-corporativo', data: Object.fromEntries(new FormData(form)) }) });
    if (!response.ok) { setState('idle'); setError('Não foi possível enviar agora. Tente novamente.'); return; }
    form.reset(); setState('success');
  }

  if (state === 'success') return <div className="germano-form germano-form--success" role="status"><span>✓</span><h3>Mensagem recebida.</h3><p>Nosso time comercial retornará em breve.</p><button className="germano-button germano-button--primary" onClick={()=>setState('idle')}>Enviar outra mensagem</button></div>;
  return <form className="germano-form" onSubmit={submit}>
    <div className="germano-form__row"><label>Nome<input name="nome" autoComplete="name" required placeholder="Como podemos chamar você?" /></label><label>Empresa<input name="empresa" autoComplete="organization" required placeholder="Nome da empresa" /></label></div>
    <label>E-mail profissional<input name="email" type="email" autoComplete="email" required placeholder="voce@empresa.com.br" /></label>
    <label>Como podemos ajudar?<textarea name="mensagem" required placeholder="Conte brevemente sobre a sua necessidade" /></label>
    {error&&<p className="form-error" role="alert">{error}</p>}
    <button className="germano-button germano-button--primary" type="submit" disabled={state==='sending'}>{state==='sending'?'Enviando…':'Enviar mensagem'} <ArrowIcon /></button>
    <small>Ao enviar, você concorda com o contato do nosso time comercial.</small>
  </form>;
}
