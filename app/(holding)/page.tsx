import Image from 'next/image';
import Link from 'next/link';
import { ArrowIcon } from '@/components/icons';
import { HoldingContactForm } from '@/components/holding-contact-form';

const capabilities = [
  { number: '01', title: 'Estratégia de produto', text: 'Leitura de mercado, definição de sortimento e desenvolvimento de linhas com posicionamento comercial claro.' },
  { number: '02', title: 'Produção gráfica', text: 'Controle de impressão, acabamento e qualidade para entregar consistência mesmo em grandes volumes.' },
  { number: '03', title: 'Operação B2B', text: 'Atendimento próximo, pedidos programados e condições desenhadas para a realidade de cada canal.' },
  { number: '04', title: 'Distribuição nacional', text: 'Planejamento de estoque, expedição e parceiros logísticos para abastecer operações em todo o Brasil.' },
];

const structure = [
  ['Desenvolvimento', 'Produtos próprios e projetos private label conduzidos da ideia à embalagem final.'],
  ['Qualidade', 'Critérios técnicos em matéria-prima, impressão e acabamento antes de cada expedição.'],
  ['Escala', 'Operação preparada para pedidos recorrentes, campanhas sazonais e redes multiloja.'],
  ['Proximidade', 'Um time comercial que acompanha o cliente antes, durante e depois do pedido.'],
];

export default function HoldingPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Grupo Germano',
    url: 'https://grupogermano.app.br',
    description: 'Holding brasileira que desenvolve marcas, produtos e soluções para o varejo.',
  };

  return <div className="germano-site">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

    <section className="germano-hero" aria-labelledby="germano-title">
      <div className="germano-hero__copy">
        <p className="germano-kicker"><span /> Grupo Germano · Rio de Janeiro</p>
        <h1 id="germano-title">Criamos produtos que <em>movem o varejo.</em></h1>
        <p className="germano-hero__lead">Há mais de uma década, transformamos inteligência comercial, design e capacidade operacional em marcas relevantes para o mercado brasileiro.</p>
        <div className="germano-actions">
          <Link href="#contato" className="germano-button germano-button--primary">Fale com nosso time <ArrowIcon /></Link>
          <Link href="#competencias" className="germano-button germano-button--quiet">Conheça a operação <span>↓</span></Link>
        </div>
      </div>
      <div className="germano-hero__visual">
        <Image src="/images/produtos-reais/linha-completa-mundo-encantado.png" alt="Produtos reais desenvolvidos pelo Grupo Germano" fill priority sizes="(max-width: 900px) 100vw, 48vw" />
        <div className="germano-hero__index"><span>10+</span><small>anos construindo<br />boas parcerias</small></div>
        <p className="germano-hero__caption">Desenvolvimento · Produção · Distribuição</p>
      </div>
    </section>

    <section className="germano-proof" aria-label="Indicadores do Grupo Germano">
      <div><strong>10+</strong><span>anos de mercado</span></div>
      <div><strong>B2B</strong><span>operação especializada</span></div>
      <div><strong>Brasil</strong><span>atendimento nacional</span></div>
      <p>Da leitura de mercado à chegada no ponto de venda, coordenamos cada etapa com visão de longo prazo.</p>
    </section>

    <section className="germano-section germano-intro" id="quem-somos">
      <div><p className="germano-kicker"><span /> Quem somos</p></div>
      <div>
        <h2>Uma holding feita para transformar boas ideias em negócios consistentes.</h2>
        <p>O Grupo Germano conecta criação, indústria e inteligência comercial para desenvolver produtos de papelaria e presentes com alto valor percebido. Trabalhamos ao lado de lojistas, distribuidores e redes varejistas para construir soluções que façam sentido na prateleira e na operação.</p>
      </div>
    </section>

    <section className="germano-section germano-capabilities" id="competencias">
      <header className="germano-section__head">
        <p className="germano-kicker germano-kicker--light"><span /> O que fazemos</p>
        <h2>Visão completa.<br /><em>Execução precisa.</em></h2>
      </header>
      <div className="germano-capability-list">
        {capabilities.map((item) => <article key={item.number}>
          <span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><i aria-hidden="true">↗</i>
        </article>)}
      </div>
    </section>

    <section className="germano-section germano-brand" id="marcas">
      <div className="germano-brand__visual">
        <span>Marca do grupo · 01</span>
        <div className="germano-brand__orbit germano-brand__orbit--one" aria-hidden="true" />
        <div className="germano-brand__orbit germano-brand__orbit--two" aria-hidden="true" />
        <div className="germano-brand__spark germano-brand__spark--one" aria-hidden="true">✦</div>
        <div className="germano-brand__spark germano-brand__spark--two" aria-hidden="true">✦</div>
        <div className="germano-brand__identity">
          <Image src="/logo_mundo_encantado.svg" alt="Mundo Encantado" width={760} height={280} sizes="(max-width: 800px) 80vw, 42vw" />
          <p>Papelaria de presente premium</p>
        </div>
        <small>Um universo de cor, afeto e boas histórias.</small>
      </div>
      <div className="germano-brand__copy">
        <p className="germano-kicker"><span /> Nosso portfólio</p>
        <p className="germano-brand__eyebrow">Mundo Encantado</p>
        <h2>Design autoral para tornar cada presente memorável.</h2>
        <p>Nossa marca própria de papelaria e presentes une estampas exclusivas, qualidade gráfica e soluções pensadas para o giro no ponto de venda.</p>
        <Link href="/mundo-encantado" className="germano-text-link">Conhecer a marca <ArrowIcon /></Link>
      </div>
    </section>

    <section className="germano-section germano-structure" id="estrutura">
      <header className="germano-section__head germano-section__head--dark">
        <p className="germano-kicker"><span /> Como operamos</p>
        <h2>Estrutura para entregar.<br /><em>Cuidado para permanecer.</em></h2>
      </header>
      <div className="germano-structure__grid">
        {structure.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>

    <section className="germano-section germano-contact" id="contato">
      <div className="germano-contact__copy">
        <p className="germano-kicker"><span /> Contato corporativo</p>
        <h2>Vamos construir a próxima oportunidade?</h2>
        <p>Conte o que sua operação precisa. Nosso time retorna com o direcionamento certo para projetos, fornecimento e parcerias.</p>
        <div className="germano-contact__details"><a href="mailto:contato@grupogermano.com.br">contato@grupogermano.com.br</a><a href="https://wa.me/5521964249896">+55 21 96424-9896</a><span>Segunda a sexta · 8h às 18h</span></div>
      </div>
      <HoldingContactForm />
    </section>
  </div>;
}
