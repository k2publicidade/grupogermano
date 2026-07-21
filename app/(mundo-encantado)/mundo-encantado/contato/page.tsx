'use client';

import { useState } from 'react';
import { CheckIcon } from '@/components/icons';

export default function ContatoPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      const response = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ form: 'contato', data }) });
      if (!response.ok) throw new Error();
      setSuccess(true);
    } catch {
      setError('Não foi possível enviar sua mensagem agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="page-hero page-hero--me">
        <div className="shell">
          <p className="section-note section-note--me">FALE CONOSCO</p>
          <h1 className="title-me">Estamos prontos para atender você</h1>
          <p className="lead-me" style={{ maxWidth: '650px' }}>
            Tem dúvidas sobre nossos produtos, prazos ou quer agendar um bate-papo comercial? Escolha o canal mais conveniente.
          </p>
        </div>
      </section>

      <section className="section shell">
        <div className="contact-grid">
          <div>
            <h2 className="title-me" style={{ fontSize: 'var(--fs-section)', marginBottom: '1.5rem' }}>Canais de Atendimento</h2>
            
            <div style={{ display: 'grid', gap: '2rem', marginTop: '2.5rem' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--me-primary)' }}>WhatsApp Comercial</strong>
                <a 
                  href="https://wa.me/5521964249896" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontSize: '1.4rem', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  (21) 96424-9896
                </a>
                <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)', fontSize: '0.88rem' }}>
                  Atendimento instantâneo de segunda a sexta, das 8h às 18h.
                </p>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--me-primary)' }}>E-mail Comercial</strong>
                <a 
                  href="mailto:comercial@grupogermano.com.br"
                  style={{ fontSize: '1.4rem', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  comercial@grupogermano.com.br
                </a>
                <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)', fontSize: '0.88rem' }}>
                  Respondemos suas dúvidas e orçamentos em até 24 horas úteis.
                </p>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--me-primary)' }}>Redes Sociais</strong>
                <a 
                  href="https://instagram.com/mundoencantado.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontSize: '1.4rem', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  @mundoencantado.br
                </a>
                <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)', fontSize: '0.88rem' }}>
                  Siga-nos no Instagram para acompanhar lançamentos e inspirações de embrulho.
                </p>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--me-bg-soft, oklch(0.97 0.01 45))', padding: '3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            {success ? (
              <div className="success-state" style={{ width: '100%' }}>
                <div className="success-icon">
                  <CheckIcon style={{ width: '2.5rem', height: '2.5rem' }} />
                </div>
                <h2>Mensagem enviada!</h2>
                <p style={{ marginTop: '1rem' }}>
                  Agradecemos seu contato. Nossa equipe analisará sua mensagem e responderá o mais breve possível.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3 className="title-me" style={{ fontSize: 'var(--fs-subtitle)', marginBottom: '1.5rem' }}>Envie uma mensagem</h3>
                
                <div className="field">
                  <label htmlFor="nome">Nome</label>
                  <input id="nome" name="nome" required placeholder="Seu nome completo" />
                </div>

                <div className="field">
                  <label htmlFor="email">E-mail corporativo</label>
                  <input id="email" name="email" type="email" required placeholder="seuemail@empresa.com" />
                </div>

                <div className="field">
                  <label htmlFor="whatsapp">WhatsApp</label>
                  <input id="whatsapp" name="whatsapp" required placeholder="(XX) XXXXX-XXXX" />
                </div>

                <div className="field">
                  <label htmlFor="mensagem">Mensagem</label>
                  <textarea id="mensagem" name="mensagem" required placeholder="Como podemos ajudar sua empresa?" />
                </div>

                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="button button--me-primary" type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
