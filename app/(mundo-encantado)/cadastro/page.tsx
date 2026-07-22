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
    <div className={`auth-form-wrap ${!level ? 'auth-form-wrap--choice' : ''}`}>{sent ? <div className="success-state"><span className="success-icon"><CheckIcon /></span><h2>Cadastro {level === 'completo' ? 'completo' : 'simples'} concluído.</h2><p>{level === 'completo' ? 'Seus dados completos foram recebidos e o download do catálogo já está liberado neste dispositivo.' : 'Seus dados essenciais foram recebidos. Complete o cadastro quando quiser liberar downloads e os demais acessos exclusivos.'}</p><Link href={level === 'completo' ? '/mundo-encantado/download' : '/catalogo'} className="button button--dark">{level === 'completo' ? 'Baixar catálogo' : 'Voltar ao catálogo'}</Link></div> : !level ?
      <div className="registration-choice">
        <div className="registration-choice__intro"><p className="section-note">CADASTRO B2BUSINESS</p><h2>Como você quer começar?</h2><p>Compare as opções. Você poderá completar o cadastro simples mais tarde.</p></div>
        <div className="registration-plans" aria-label="Opções de cadastro B2B">
          <article className="registration-plan registration-plan--simple">
            <div className="registration-plan__top"><span className="registration-plan__number">01</span><span className="registration-plan__tag">SEM BUROCRACIA</span></div>
            <div><h3>Cadastro simples</h3><p>Para quem quer apenas registrar a empresa e manter contato com a marca.</p></div>
            <div className="registration-plan__time"><strong>~1 min</strong><span>6 dados essenciais</span></div>
            <ul><li><CheckIcon /> Empresa e CNPJ</li><li><CheckIcon /> Responsável e contato</li><li className="is-locked"><LockIcon /> Sem downloads e orçamento</li></ul>
            <button type="button" className="button button--outline button--full" onClick={() => setLevel('basico')}>Quero só me cadastrar <span aria-hidden="true">→</span></button>
          </article>
          <article className="registration-plan registration-plan--complete">
            <div className="registration-plan__top"><span className="registration-plan__number">02</span><span className="registration-plan__tag">ACESSO LIBERADO</span></div>
            <div><h3>Cadastro completo</h3><p>Para lojistas que querem usar agora os recursos exclusivos do portal B2B.</p></div>
            <div className="registration-plan__time"><strong>~3 min</strong><span>dados fiscais e endereço</span></div>
            <ul><li><CheckIcon /> Inclui inscrição estadual</li><li><CheckIcon /> Download do catálogo PDF</li><li><CheckIcon /> Ferramenta de orçamento</li></ul>
            <button type="button" className="button button--dark button--full" onClick={() => setLevel('completo')}>Quero acesso completo <span aria-hidden="true">→</span></button>
          </article>
        </div>
        <p className="registration-choice__footnote"><LockIcon /> Seus dados são usados somente para atendimento comercial.</p>
      </div> :
      <form className="signup-form" onSubmit={submit}>
        <div className={`registration-selection registration-selection--${level}`}><div><span>VOCÊ ESCOLHEU</span><strong>Cadastro {level === 'completo' ? 'completo' : 'simples'}</strong><small>{level === 'completo' ? 'Libera catálogo PDF e orçamento' : 'Somente registro, sem liberar acessos'}</small></div><button type="button" onClick={() => { setError(''); setLevel(null); }}>Trocar opção</button></div>
        <div><p className="section-note">ETAPA ÚNICA</p><h2>{level === 'completo' ? 'Complete os dados da empresa' : 'Conte o essencial sobre a empresa'}</h2><p>{level === 'completo' ? 'Todos os campos abaixo são necessários para liberar seu acesso.' : 'Poucos dados para concluir seu registro.'}</p></div>
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
        {level === 'basico' && <p className="registration-notice"><LockIcon /> Este cadastro não libera downloads nem orçamentos. Você poderá completá-lo depois.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}<button className="button button--dark button--full" type="submit" disabled={loading}>{loading ? 'Enviando…' : `Concluir cadastro ${level === 'completo' ? 'completo' : 'simples'}`} <LockIcon /></button>
      </form>}
    </div>
  </section>;
}
