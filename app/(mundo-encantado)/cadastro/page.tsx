'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckIcon, LockIcon } from '@/components/icons';

type RegistrationLevel = 'basico' | 'completo';

export default function SignupPage() {
  const [level, setLevel] = useState<RegistrationLevel>('basico');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('nivel') === 'completo') setLevel('completo');
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('');
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ form: 'cadastro', data }) });
    setLoading(false);
    if (response.ok) setSent(true); else setError('Não foi possível enviar agora. Confira os campos e tente novamente.');
  }

  return <section className="auth-page">
    <div className="auth-aside"><p className="section-note">PORTAL DO PARCEIRO</p><h1>Comece agora. Complete quando precisar.</h1><p>O cadastro básico registra sua empresa. O completo libera downloads e os acessos exclusivos do portal.</p><div className="auth-benefits"><span><CheckIcon /> Cadastro básico rápido</span><span><CheckIcon /> Dados empresariais validados</span><span><CheckIcon /> Downloads no cadastro completo</span></div></div>
    <div className="auth-form-wrap">{sent ? <div className="success-state"><span className="success-icon"><CheckIcon /></span><h2>Cadastro {level} concluído.</h2><p>{level === 'completo' ? 'Seus dados completos foram recebidos e o download do catálogo já está liberado neste dispositivo.' : 'Seus dados básicos foram recebidos. Complete o cadastro quando quiser liberar downloads e os demais acessos exclusivos.'}</p><Link href={level === 'completo' ? '/mundo-encantado/download' : '/catalogo'} className="button button--dark">{level === 'completo' ? 'Baixar catálogo' : 'Voltar ao catálogo'}</Link></div> :
      <form className="signup-form" onSubmit={submit}>
        <div><p className="section-note">CADASTRO B2BUSINESS</p><h2>Dados da empresa</h2><p>Escolha o nível de cadastro adequado para você.</p></div>
        <div className="registration-level" role="group" aria-label="Nível do cadastro"><button type="button" className={level === 'basico' ? 'is-active' : ''} onClick={() => setLevel('basico')} aria-pressed={level === 'basico'}><strong>Básico</strong><span>Cadastro rápido, sem liberar downloads.</span></button><button type="button" className={level === 'completo' ? 'is-active' : ''} onClick={() => setLevel('completo')} aria-pressed={level === 'completo'}><strong>Completo</strong><span>Todos os dados e acessos liberados.</span></button></div>
        <input type="hidden" name="nivelCadastro" value={level} />
        <div className="form-grid form-grid--2"><div className="field"><label htmlFor="razao">Razão social</label><input id="razao" name="razaoSocial" required autoComplete="organization" /></div><div className="field"><label htmlFor="cnpj">CNPJ</label><input id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" required inputMode="numeric" /></div></div>
        {level === 'completo' && <>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="fantasia">Nome fantasia</label><input id="fantasia" name="nomeFantasia" required /></div><div className="field"><label htmlFor="ie">Inscrição estadual</label><input id="ie" name="inscricaoEstadual" required /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="segmento">Segmento</label><select id="segmento" name="segmento" required defaultValue=""><option value="" disabled>Selecione</option><option>Papelaria</option><option>Loja de presentes</option><option>Atacado / distribuição</option><option>Outro varejo</option></select></div><div className="field"><label htmlFor="cep">CEP</label><input id="cep" name="cep" required inputMode="numeric" autoComplete="postal-code" /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="endereco">Endereço</label><input id="endereco" name="endereco" required autoComplete="street-address" /></div><div className="field"><label htmlFor="numero">Número</label><input id="numero" name="numero" required /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="bairro">Bairro</label><input id="bairro" name="bairro" required /></div><div className="field"><label htmlFor="complemento">Complemento <span>(opcional)</span></label><input id="complemento" name="complemento" /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="cidade">Cidade</label><input id="cidade" name="cidade" required autoComplete="address-level2" /></div><div className="field"><label htmlFor="estado">UF</label><input id="estado" name="estado" required maxLength={2} placeholder="SP" autoComplete="address-level1" /></div></div>
        </>}
        <hr /><div><h3>Responsável pela empresa</h3></div>
        <div className="form-grid form-grid--2"><div className="field"><label htmlFor="responsavel">Nome</label><input id="responsavel" name="responsavel" required autoComplete="name" /></div><div className="field"><label htmlFor="cargo">Cargo {level === 'basico' && <span>(opcional)</span>}</label><input id="cargo" name="cargo" required={level === 'completo'} /></div></div>
        <div className="form-grid form-grid--2"><div className="field"><label htmlFor="email-cadastro">E-mail profissional</label><input id="email-cadastro" name="email" type="email" required autoComplete="email" /></div><div className="field"><label htmlFor="telefone">WhatsApp</label><input id="telefone" name="telefone" type="tel" required autoComplete="tel" /></div></div>
        <label className="checkbox"><input name="consentimento" value="aceito" type="checkbox" required /><span>Confirmo que represento a empresa informada e aceito o tratamento dos dados para atendimento comercial.</span></label>
        {level === 'basico' && <p className="registration-notice">O cadastro básico não libera downloads. Você poderá completar seus dados posteriormente.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}<button className="button button--dark button--full" type="submit" disabled={loading}>{loading ? 'Enviando…' : `Concluir cadastro ${level}`} <LockIcon /></button>
      </form>}
    </div>
  </section>;
}
