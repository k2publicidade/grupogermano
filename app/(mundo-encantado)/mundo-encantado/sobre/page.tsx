import Image from 'next/image';
import Link from 'next/link';
import { ArrowIcon } from '@/components/icons';

export const metadata = {
  title: 'Sobre a Marca',
  description: 'Conheça o propósito, a história e os valores da Mundo Encantado.'
};

export default function SobrePage() {
  return (
    <>
      <section className="page-hero page-hero--me">
        <div className="shell">
          <p className="section-note section-note--me">PROPÓSITO & QUALIDADE</p>
          <h1 className="title-me" style={{ maxWidth: '850px' }}>Estampas autorais e acabamento de alto padrão.</h1>
          <p className="lead-me">
            Nossa missão é transformar embrulhos em sentimentos tangíveis, entregando o mais alto padrão em design e qualidade para lojistas de todo o Brasil.
          </p>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="section shell">
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 className="title-me" style={{ fontSize: 'var(--fs-section)', marginBottom: '1.5rem' }}>Acreditamos nos rituais de afeto</h2>
            <p style={{ marginBottom: '1.2rem' }}>
              No ritmo acelerado do dia a dia, parar para embrulhar um presente é um gesto deliberado de carinho. É reservar um tempo para pensar no outro, escolher as estampas que combinam com seu jeito de ser e prender cada laço com cuidado.
            </p>
            <p style={{ marginBottom: '1.2rem' }}>
              A <strong>Mundo Encantado</strong> nasceu para que esses gestos se tornassem ainda mais belos. Desenvolvemos papéis de presente com texturas suaves, espessuras perfeitas para dobrar e padrões exclusivos criados em nosso ateliê próprio.
            </p>
            <p>
              Unimos a doçura do universo infantil com a elegância de padrões geométricos e florais adultos. Assim, atendemos a todas as ocasiões de presente sob uma marca de prestígio e confiança.
            </p>
          </div>
          <div style={{ position: 'relative', height: '450px', background: 'var(--soft)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <Image 
              src="/images/produtos-reais/kit-30x44-rosa-perspectiva.png" 
              alt="Processo artesanal de embalar presentes com papéis decorados" 
              fill 
              sizes="(max-width: 768px) 100vw, 40vw"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>

      {/* Diferenciais e Qualidade */}
      <section className="section dark-section dark-section--me">
        <div className="shell">
          <div className="section-head section-head--me">
            <div>
              <p className="section-note section-note--me" style={{ color: 'var(--me-accent)' }}>CAPACIDADE INDUSTRIAL</p>
              <h2 className="title-me">Infraestrutura gráfica e distribuição</h2>
            </div>
            <p style={{ color: 'oklch(0.85 0.02 45)' }}>
              Nossos produtos são desenvolvidos e impressos sob a supervisão direta do Grupo Germano.
            </p>
          </div>

          <div className="principles" style={{ marginTop: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="principle-item" style={{ border: 0, paddingBlock: '1rem' }}>
                <span style={{ color: 'var(--me-accent)', fontSize: '1.1rem' }}>✦</span>
                <div>
                  <h3 style={{ color: 'white' }}>Design Autoral</h3>
                  <p style={{ color: 'oklch(0.85 0.02 45)' }}>Não compramos pacotes de estampas prontos. Nossas ilustrações são desenhadas à mão ou vetorizadas em nosso próprio estúdio de design, garantindo exclusividade absoluta no ponto de venda.</p>
                </div>
              </div>
              <div className="principle-item" style={{ border: 0, paddingBlock: '1rem' }}>
                <span style={{ color: 'var(--me-accent)', fontSize: '1.1rem' }}>✦</span>
                <div>
                  <h3 style={{ color: 'white' }}>Gramatura e Toque</h3>
                  <p style={{ color: 'oklch(0.85 0.02 45)' }}>Papéis finos rasgam facilmente durante o embrulho, gerando frustração. Utilizamos papel couchê especial de 70g/m² ou kraft premium que oferecem resistência e dobra firme.</p>
                </div>
              </div>
              <div className="principle-item" style={{ border: 0, paddingBlock: '1rem' }}>
                <span style={{ color: 'var(--me-accent)', fontSize: '1.1rem' }}>✦</span>
                <div>
                  <h3 style={{ color: 'white' }}>Sustentabilidade Operacional</h3>
                  <p style={{ color: 'oklch(0.85 0.02 45)' }}>Todos os nossos papéis e embalagens provêm de florestas geridas de forma responsável com certificações ambientais e de reflorestamento.</p>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', height: '400px', background: 'var(--graphite)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <Image 
                src="/images/produtos-reais/linha-completa-mundo-encantado.png" 
                alt="Bobina de papel na fábrica" 
                fill 
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="shell section text-center">
        <div className="quote-banner" style={{ background: 'var(--me-bg-soft, oklch(0.97 0.01 45))', borderRadius: 'var(--radius-md)' }}>
          <div>
            <p className="section-note section-note--me">QUER REVENDER?</p>
            <h2 className="title-me">Parceria de longo prazo para o seu varejo.</h2>
            <p>Cadastre-se hoje mesmo para ter acesso a valores exclusivos B2B, displays e condições comerciais de feira.</p>
          </div>
          <Link href="/mundo-encantado/revendedor" className="button button--me-primary">
            Quero me Cadastrar <ArrowIcon />
          </Link>
        </div>
      </section>
    </>
  );
}
