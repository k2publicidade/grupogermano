'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckIcon, LockIcon } from '@/components/icons';

type RegistrationLevel = 'basico' | 'completo';

export default function SignupPage() {
  const [level, setLevel] = useState<RegistrationLevel | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const requestedLevel = new URLSearchParams(window.location.search).get('nivel');
    if (requestedLevel === 'completo') setLevel('completo');
    if (requestedLevel === 'simples' || requestedLevel === 'basico') setLevel('basico');
  }, []);

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
    <div className="auth-aside"><p className="section-note">PORTAL DO PARCEIRO</p><h1>Seu cadastro, no seu momento.</h1><p>Escolha o caminho que faz sentido agora. Você pode começar com o essencial ou preencher tudo para acessar as ferramentas B2B.</p><div className="auth-benefits"><span><CheckIcon /> Comece sem burocracia</span><span><CheckIcon /> Complete quando precisar</span><span><CheckIcon /> Saiba exatamente o que será liberado</span></div></div>
    <div className={`auth-form-wrap ${!level ? 'auth-form-wrap--choice' : ''}`}>{sent ? <div className="success-state"><span className="success-icon"><CheckIcon /></span><h2>Cadastro {level === 'completo' ? 'completo' : 'básico'} concluído.</h2><p>{level === 'completo' ? 'Seus dados completos foram recebidos e o download do catálogo já está liberado neste dispositivo.' : 'Seus dados de contato foram recebidos. Complete o cadastro quando quiser informar os dados da empresa e liberar os acessos exclusivos.'}</p><Link href={level === 'completo' ? '/mundo-encantado/download' : '/catalogo'} className="button button--dark">{level === 'completo' ? 'Baixar catálogo' : 'Voltar ao catálogo'}</Link></div> : !level ?
      <div className="registration-choice">
        <div className="registration-choice__intro"><p className="section-note">CADASTRO B2BUSINESS</p><h2>Como você quer começar?</h2><p>Compare as opções. Você poderá transformar o cadastro básico em completo mais tarde.</p></div>
        <div className="registration-plans" aria-label="Opções de cadastro B2B">
          <article className="registration-plan registration-plan--simple">
            <div className="registration-plan__top"><span className="registration-plan__number">01</span><span className="registration-plan__tag">SEM BUROCRACIA</span></div>
            <div><h3>Cadastro básico</h3><p>Para quem quer deixar seu contato e começar o relacionamento com a marca.</p></div>
            <div className="registration-plan__time"><strong>~1 min</strong><span>nome, e-mail e telefone</span></div>
            <ul><li><CheckIcon /> Apenas informações de contato</li><li><CheckIcon /> Sem dados fiscais da empresa</li><li className="is-locked"><LockIcon /> Sem downloads e orçamento</li></ul>
            <button type="button" className="button button--outline button--full" onClick={() => setLevel('basico')}>Quero só me cadastrar <span aria-hidden="true">→</span></button>
          </article>
          <article className="registration-plan registration-plan--complete">
            <div className="registration-plan__top"><span className="registration-plan__number">02</span><span className="registration-plan__tag">ACESSO LIBERADO</span></div>
            <div><h3>Cadastro completo</h3><p>Para empresas que querem informar todos os dados e usar os recursos exclusivos do portal B2B.</p></div>
            <div className="registration-plan__time"><strong>~3 min</strong><span>dados fiscais e endereço</span></div>
            <ul><li><CheckIcon /> Inclui inscrição estadual</li><li><CheckIcon /> Download do catálogo PDF</li><li><CheckIcon /> Ferramenta de orçamento</li></ul>
            <button type="button" className="button button--dark button--full" onClick={() => setLevel('completo')}>Quero acesso completo <span aria-hidden="true">→</span></button>
          </article>
        </div>
        <p className="registration-choice__footnote"><LockIcon /> Seus dados são usados somente para atendimento comercial.</p>
      </div> :
      <form className="signup-form" onSubmit={submit}>
        <div className={`registration-selection registration-selection--${level}`}><div><span>VOCÊ ESCOLHEU</span><strong>Cadastro {level === 'completo' ? 'completo' : 'básico'}</strong><small>{level === 'completo' ? 'Todos os dados da empresa e acessos B2B' : 'Somente nome, e-mail e telefone'}</small></div><button type="button" onClick={() => { setError(''); setLevel(null); }}>Trocar opção</button></div>
        <div><p className="section-note">ETAPA ÚNICA</p><h2>{level === 'completo' ? 'Complete os dados da empresa' : 'Informe seus dados de contato'}</h2><p>{level === 'completo' ? 'Preencha os dados cadastrais, fiscais e de contato para liberar seu acesso.' : 'Precisamos apenas das informações básicas para manter contato com você.'}</p></div>
        <input type="hidden" name="nivelCadastro" value={level} />
        {level === 'completo' && <>
          <div><h3>Dados cadastrais</h3></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="razao">Razão social</label><input id="razao" name="razaoSocial" required autoComplete="organization" /></div><div className="field"><label htmlFor="cnpj">CNPJ</label><input id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" required inputMode="numeric" /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="fantasia">Nome fantasia</label><input id="fantasia" name="nomeFantasia" required /></div><div className="field"><label htmlFor="ie">Inscrição estadual</label><input id="ie" name="inscricaoEstadual" required /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="segmento">Segmento</label><select id="segmento" name="segmento" required defaultValue=""><option value="" disabled>Selecione</option><option>Papelaria</option><option>Loja de presentes</option><option>Atacado / distribuição</option><option>Outro varejo</option></select></div><div className="field"><label htmlFor="cep">CEP</label><input id="cep" name="cep" required inputMode="numeric" autoComplete="postal-code" /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="endereco">Endereço</label><input id="endereco" name="endereco" required autoComplete="street-address" /></div><div className="field"><label htmlFor="numero">Número</label><input id="numero" name="numero" required /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="bairro">Bairro</label><input id="bairro" name="bairro" required /></div><div className="field"><label htmlFor="complemento">Complemento <span>(opcional)</span></label><input id="complemento" name="complemento" /></div></div>
          <div className="form-grid form-grid--2"><div className="field"><label htmlFor="cidade">Cidade</label><input id="cidade" name="cidade" required autoComplete="address-level2" /></div><div className="field"><label htmlFor="estado">UF</label><input id="estado" name="estado" required maxLength={2} placeholder="SP" autoComplete="address-level1" /></div></div>
        </>}
        {level === 'completo' && <hr />}<div><h3>{level === 'completo' ? 'Responsável pela empresa' : 'Seus dados básicos'}</h3></div>
        <div className={`form-grid ${level === 'completo' ? 'form-grid--2' : ''}`}><div className="field"><label htmlFor="responsavel">Nome</label><input id="responsavel" name="responsavel" required autoComplete="name" /></div>{level === 'completo' && <div className="field"><label htmlFor="cargo">Cargo</label><input id="cargo" name="cargo" required /></div>}</div>
        <div className="form-grid form-grid--2"><div className="field"><label htmlFor="email-cadastro">E-mail</label><input id="email-cadastro" name="email" type="email" required autoComplete="email" /></div><div className="field"><label htmlFor="telefone">Telefone / WhatsApp</label><input id="telefone" name="telefone" type="tel" required autoComplete="tel" /></div></div>
        <label className="checkbox"><input name="consentimento" value="aceito" type="checkbox" required /><span>{level === 'completo' ? 'Confirmo que represento a empresa informada e aceito o tratamento dos dados para atendimento comercial.' : 'Aceito o tratamento dos meus dados para contato e atendimento comercial.'}</span></label>
        {level === 'basico' && <p className="registration-notice"><LockIcon /> Este cadastro não libera downloads nem orçamentos. Você poderá completá-lo depois.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}<button className="button button--dark button--full" type="submit" disabled={loading}>{loading ? 'Enviando…' : `Concluir cadastro ${level === 'completo' ? 'completo' : 'básico'}`} <LockIcon /></button>
      </form>}
    </div>
  </section>;
}
