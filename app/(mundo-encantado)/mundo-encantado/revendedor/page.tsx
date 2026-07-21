'use client';

import { useState } from 'react';
import { CheckIcon } from '@/components/icons';

export default function RevendedorPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    cnpj: '',
    cidade: '',
    estado: '',
    segmento: 'papelaria'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ form: 'revendedor', data: formData }) });
    setLoading(false);
    if (response.ok) {
      setSuccess(true);
      const message = `Olá, gostaria de solicitar atendimento comercial para revender Mundo Encantado B2B.\n\n*Dados do Cliente:*\n- Nome: ${formData.nome}\n- WhatsApp: ${formData.whatsapp}\n- E-mail: ${formData.email}\n- CNPJ: ${formData.cnpj}\n- Local: ${formData.cidade} - ${formData.estado}\n- Segmento: ${formData.segmento.toUpperCase()}`;
      
      const whatsappUrl = `https://wa.me/5521964249896?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <>      <section className="page-hero page-hero--me">
        <div className="shell">
          <p className="section-note section-note--me">PARCERIA COMERCIAL</p>
          <h1 className="title-me">Seja um revendedor Mundo Encantado</h1>
          <p className="lead-me" style={{ maxWidth: '750px' }}>
            Aumente o faturamento médio do seu ponto de venda oferecendo produtos de alta aceitação, excelente margem de lucro e display pronto para exposição.
          </p>
        </div>
      </section>

      <section className="section shell">
        <div className="contact-grid">
          {/* Lojista Info */}
          <div>
            <h2 className="title-me" style={{ fontSize: 'var(--fs-section)', marginBottom: '1.5rem' }}>Por que fazer parceria conosco?</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ fontSize: '1.4rem' }}>📦</span>
                <div>
                  <h3 style={{ fontSize: 'var(--fs-subtitle)', fontWeight: 'bold', margin: '0 0 0.3rem' }}>Display Pronto para Exposição</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Ganchos e prateleiras ajustadas. Ocupa pouco espaço e garante que os rolos fiquem organizados e atrativos.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ fontSize: '1.4rem' }}>📈</span>
                <div>
                  <h3 style={{ fontSize: 'var(--fs-subtitle)', fontWeight: 'bold', margin: '0 0 0.3rem' }}>Giro Garantido</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Papéis de presente e livros infantis são mercadorias sazonais e recorrentes de venda ágil, ideais para o caixa e checkout.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ fontSize: '1.4rem' }}>💰</span>
                <div>
                  <h3 style={{ fontSize: 'var(--fs-subtitle)', fontWeight: 'bold', margin: '0 0 0.3rem' }}>Altas Margens de Lucro</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Tabelas diferenciadas por volume que asseguram margens muito competitivas para o pequeno, médio ou grande varejo.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🔄</span>
                <div>
                  <h3 style={{ fontSize: 'var(--fs-subtitle)', fontWeight: 'bold', margin: '0 0 0.3rem' }}>Reposição Descomplicada</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Fábrica com estoque contínuo. Despachamos novos lotes rapidamente para que sua prateleira nunca fique vazia.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Capture Form */}
          <div style={{ background: 'var(--me-bg-soft, oklch(0.97 0.01 45))', padding: '3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            {success ? (
              <div className="success-state" style={{ width: '100%' }}>
                <div className="success-icon" style={{ background: 'var(--black)', color: 'white' }}>
                  <CheckIcon style={{ width: '2.5rem', height: '2.5rem' }} />
                </div>
                <h2>Cadastro Inicial Concluído!</h2>
                <p style={{ margin: '1.5rem 0' }}>
                  Muito obrigado pelo interesse! Estamos direcionando você para o WhatsApp do nosso time comercial oficial para agilizar seu atendimento.
                </p>
                <a 
                  href={`https://wa.me/5521964249896?text=${encodeURIComponent(`Olá, gostaria de dar andamento ao meu cadastro de revendedor (Nome: ${formData.nome}, CNPJ: ${formData.cnpj}).`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="button button--me-primary button--full"
                >
                  Continuar no WhatsApp
                </a>
              </div>
            ) : (
              <div>
                <h3 className="title-me" style={{ fontSize: 'var(--fs-subtitle)', marginBottom: '0.4rem' }}>Fale com nosso Comercial</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '2rem' }}>
                  Preencha os dados e fale instantaneamente com um representante no WhatsApp.
                </p>
                
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="field">
                    <label htmlFor="nome">Nome Completo</label>
                    <input 
                      id="nome" 
                      name="nome" 
                      required 
                      value={formData.nome} 
                      onChange={handleChange} 
                      placeholder="Nome do comprador ou responsável" 
                    />
                  </div>

                  <div className="form-grid form-grid--2">
                    <div className="field">
                      <label htmlFor="whatsapp">WhatsApp Celular</label>
                      <input 
                        id="whatsapp" 
                        name="whatsapp" 
                        required 
                        value={formData.whatsapp} 
                        onChange={handleChange} 
                        placeholder="(21) 99999-9999" 
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="cnpj">CNPJ da Empresa</label>
                      <input 
                        id="cnpj" 
                        name="cnpj" 
                        required 
                        value={formData.cnpj} 
                        onChange={handleChange} 
                        placeholder="00.000.000/0001-00" 
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="email">E-mail Profissional</label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="comercial@sualoja.com.br" 
                    />
                  </div>

                  <div className="form-grid form-grid--2">
                    <div className="field">
                      <label htmlFor="cidade">Cidade</label>
                      <input 
                        id="cidade" 
                        name="cidade" 
                        required 
                        value={formData.cidade} 
                        onChange={handleChange} 
                        placeholder="Ex: Rio de Janeiro" 
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="estado">Estado (UF)</label>
                      <input 
                        id="estado" 
                        name="estado" 
                        required 
                        maxLength={2} 
                        value={formData.estado} 
                        onChange={handleChange} 
                        placeholder="RJ" 
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="segmento">Tipo de Loja / Canal</label>
                    <select id="segmento" name="segmento" value={formData.segmento} onChange={handleChange}>
                      <option value="papelaria">Papelaria / Livraria</option>
                      <option value="presentes">Loja de Presentes / Variedades</option>
                      <option value="brinquedos">Loja de Brinquedos</option>
                      <option value="supermercado">Supermercado / Bazar</option>
                      <option value="distribuidora">Distribuidora / Atacado</option>
                    </select>
                  </div>

                  <button 
                    className="button button--me-primary button--full" 
                    type="submit" 
                    disabled={loading}
                    style={{ marginTop: '1rem' }}
                  >
                    {loading ? 'Processando...' : 'Solicitar Atendimento'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
