'use client';

import { useState } from 'react';
import { DownloadIcon, CheckIcon } from '@/components/icons';

export default function DownloadPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    empresa: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const response = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ form: 'download', data: formData }) });
    setLoading(false);
    if (response.ok) {
      setSuccess(true);
      
      // Trigger browser download of the temporary catalog
      const link = document.createElement('a');
      link.href = '/api/catalogo-pdf';
      link.download = 'catalogo-mundo-encantado-2026.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <section className="page-hero page-hero--me">
        <div className="shell">
          <p className="section-note section-note--me">DOWNLOAD DO CATÁLOGO</p>
          <h1 className="title-me">Receba nossa coleção digital</h1>
          <p className="lead-me" style={{ maxWidth: '650px' }}>
            Preencha seus dados comerciais para baixar instantaneamente nosso catálogo de lançamentos da feira SERVIP em formato PDF.
          </p>
        </div>
      </section>

      <section className="section shell">
        <div style={{ maxWidth: '600px', marginInline: 'auto', background: 'var(--me-bg-soft, oklch(0.97 0.01 45))', padding: '3.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
          {success ? (
            <div className="success-state" style={{ width: '100%' }}>
              <div className="success-icon" style={{ background: 'var(--black)', color: 'white' }}>
                <CheckIcon style={{ width: '2.5rem', height: '2.5rem' }} />
              </div>
              <h2>Download Iniciado!</h2>
              <p style={{ margin: '1.5rem 0' }}>
                O catálogo PDF da Mundo Encantado está sendo baixado em seu dispositivo. Caso o download não tenha começado automaticamente, clique no botão abaixo.
              </p>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <a 
                  href="/api/catalogo-pdf" 
                  download 
                  className="button button--me-primary"
                >
                  <DownloadIcon /> Forçar Download
                </a>
                
                <a 
                  href={`https://wa.me/5521964249896?text=${encodeURIComponent(`Olá, acabei de baixar o catálogo digital da Mundo Encantado e gostaria de solicitar uma cotação para minha empresa (Nome: ${formData.nome}).`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="button button--outline"
                  style={{ borderColor: 'var(--black)' }}
                >
                  Falar com Representante no WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h3 className="title-me" style={{ fontSize: 'var(--fs-subtitle)', marginBottom: '0.5rem', textAlign: 'center' }}>Acesse o Catálogo 2026</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.86rem', textAlign: 'center', marginBottom: '2rem' }}>
                Informe seus dados corporativos para liberar o arquivo.
              </p>

              <div className="field">
                <label htmlFor="nome">Nome Completo</label>
                <input 
                  id="nome" 
                  name="nome" 
                  required 
                  value={formData.nome} 
                  onChange={handleChange} 
                  placeholder="Seu nome" 
                />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">WhatsApp / Celular</label>
                <input 
                  id="whatsapp" 
                  name="whatsapp" 
                  required 
                  value={formData.whatsapp} 
                  onChange={handleChange} 
                  placeholder="(XX) XXXXX-XXXX" 
                />
              </div>

              <div className="field">
                <label htmlFor="email">E-mail Corporativo</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="comercial@suaempresa.com" 
                />
              </div>

              <div className="field">
                <label htmlFor="empresa">Nome da Empresa / Loja</label>
                <input 
                  id="empresa" 
                  name="empresa" 
                  required 
                  value={formData.empresa} 
                  onChange={handleChange} 
                  placeholder="Razão Social ou Nome Fantasia" 
                />
              </div>

              <button className="button button--me-primary button--full" type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? 'Preparando arquivo...' : 'Liberar Catálogo (PDF)'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
