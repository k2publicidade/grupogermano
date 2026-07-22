'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { CheckIcon, LockIcon } from '@/components/icons';

export default function SignupPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = Object.fromEntries(new FormData(event.currentTarget).entries());
      const response = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ form: 'cadastro', data }) });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error);
      setSent(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error && submissionError.message
        ? submissionError.message
        : 'Não foi possível enviar agora. Confira os campos e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return <section className="auth-page">
    <div className="auth-aside"><p className="section-note">PORTAL DO PARCEIRO</p><h1>Condições feitas para quem vende.</h1><p>Cadastre sua empresa para acessar os recursos e materiais exclusivos do portal B2B.</p><div className="auth-benefits"><span><CheckIcon /> Cadastro empresarial completo</span><span><CheckIcon /> Catálogo e materiais exclusivos</span><span><CheckIcon /> Ferramenta de orçamento</span></div></div>
    <div className="auth-form-wrap">{sent ? <div className="success-state"><span className="success-icon"><CheckIcon /></span><h2>Cadastro completo concluído.</h2><p>Seus dados foram recebidos e o download do catálogo já está liberado neste dispositivo.</p><Link href="/mundo-encantado/download" className="button button--dark">Baixar catálogo</Link></div> :
      <form className="signup-form" onSubmit={submit}>
        <div><p className="section-note">CADASTRO B2BUSINESS</p><h2>Dados da empresa</h2><p>Preencha os dados cadastrais e de contato. CNPJ e Inscrição Estadual são opcionais.</p></div>
        <input type="hidden" name="nivelCadastro" value="completo" />
        <div><h3>Dados cadastrais</h3></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="razao">Razão social</label><input id="razao" name="razaoSocial" required autoComplete="organization" /></div><div className="field"><label htmlFor="cnpj">CNPJ <span>(opcional)</span></label><input id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" inputMode="numeric" /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="fantasia">Nome fantasia</label><input id="fantasia" name="nomeFantasia" required /></div><div className="field"><label htmlFor="ie">Inscrição estadual <span>(opcional)</span></label><input id="ie" name="inscricaoEstadual" /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="segmento">Segmento</label><select id="segmento" name="segmento" required defaultValue=""><option value="" disabled>Selecione</option><option>Papelaria</option><option>Loja de presentes</option><option>Atacado / distribuição</option><option>Outro varejo</option></select></div><div className="field"><label htmlFor="cep">CEP</label><input id="cep" name="cep" required inputMode="numeric" autoComplete="postal-code" /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="endereco">Endereço</label><input id="endereco" name="endereco" required autoComplete="street-address" /></div><div className="field"><label htmlFor="numero">Número</label><input id="numero" name="numero" required /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="bairro">Bairro</label><input id="bairro" name="bairro" required /></div><div className="field"><label htmlFor="complemento">Complemento <span>(opcional)</span></label><input id="complemento" name="complemento" /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="cidade">Cidade</label><input id="cidade" name="cidade" required autoComplete="address-level2" /></div><div className="field"><label htmlFor="estado">UF</label><input id="estado" name="estado" required maxLength={2} placeholder="SP" autoComplete="address-level1" /></div></div>
        <hr /><div><h3>Responsável pela empresa</h3></div>
        <div className="form-grid form-grid--2"><div className="field"><label htmlFor="responsavel">Nome</label><input id="responsavel" name="responsavel" required autoComplete="name" /></div><div className="field"><label htmlFor="cargo">Cargo</label><input id="cargo" name="cargo" required /></div></div>
        <div className="form-grid form-grid--2"><div className="field"><label htmlFor="email-cadastro">E-mail</label><input id="email-cadastro" name="email" type="email" required autoComplete="email" /></div><div className="field"><label htmlFor="telefone">Telefone / WhatsApp</label><input id="telefone" name="telefone" type="tel" required autoComplete="tel" /></div></div>
        <label className="checkbox"><input name="consentimento" value="aceito" type="checkbox" required /><span>Confirmo que represento a empresa informada e aceito o tratamento dos dados para atendimento comercial.</span></label>
        {error && <p className="form-error" role="alert">{error}</p>}<button className="button button--dark button--full" type="submit" disabled={loading}>{loading ? 'Enviando…' : 'Concluir cadastro completo'} <LockIcon /></button>
      </form>}
    </div>
  </section>;
}
