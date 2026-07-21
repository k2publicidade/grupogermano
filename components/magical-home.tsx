'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const Stars = () => <span className="magic-stars" aria-hidden="true">✦　·　✧</span>;

export function MagicalHome() {
  const root = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/cms', { cache: 'no-store' }).then((response) => response.json()).then((data) => setContent(Object.fromEntries(data.content.map((item: { key: string; value: string }) => [item.key, item.value])))).catch(() => null);
    const node = root.current;
    if (!node || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = () => {
      const y = window.scrollY;
      node.style.setProperty('--scroll', `${y}px`);
    };
    move();
    window.addEventListener('scroll', move, { passive: true });
    return () => window.removeEventListener('scroll', move);
  }, []);
  const value = (key: string, fallback: string) => content[key] ?? fallback;

  return (
    <div ref={root} className="magic-home" id="marca">
      <section className="magic-hero">
        <div className="magic-orbit magic-orbit--one" aria-hidden="true" />
        <div className="magic-orbit magic-orbit--two" aria-hidden="true" />
        <div className="magic-planet" aria-hidden="true">
          <img src="/globo_logo_mundo_encantado.svg" alt="" />
        </div>
        <Stars />
        <div className="magic-shell magic-hero__grid">
          <div className="magic-hero__copy">
            <p className="magic-eyebrow">{value('hero.eyebrow', 'Papelaria que faz a loja sorrir')}</p>
            <h1><AccentTitle text={value('hero.title', 'Presentes que ganham vida.')} /></h1>
            <p className="magic-lead">{value('hero.description', 'Estampas autorais, acabamento premium e um mix pronto para encantar seus clientes — da prateleira até o laço final.')}</p>
            <div className="magic-actions">
              <Link href="#catalogo-produtos" className="magic-button">Explorar produtos <span>↓</span></Link>
              <Link href="/mundo-encantado/download" className="magic-link">Baixar catálogo PDF <span>↗</span></Link>
            </div>
            <div className="magic-proof"><b>Do nosso mundo<br />para todo o Brasil</b><span>Estampas exclusivas</span><span>Reposição facilitada</span></div>
          </div>
          <div className="magic-hero__visual">
            <div className="magic-photo magic-photo--hero magic-photo--product"><Image src={value('hero.image', '/images/produtos-reais/kit-30x44-rosa-perspectiva.png')} alt="Kit Presente Encantado em destaque" fill priority sizes="(max-width: 800px) 90vw, 46vw" /></div>
            <div className="magic-seal"><span>feito para</span><strong>encantar</strong><span>e vender ✦</span></div>
            <span className="magic-doodle magic-doodle--arrow" aria-hidden="true">↝</span>
          </div>
        </div>
        <svg className="magic-wave" viewBox="0 0 1440 150" preserveAspectRatio="none" aria-hidden="true"><path d="M0,55 C260,145 420,0 710,54 C970,102 1140,150 1440,48 L1440,150 L0,150 Z" /></svg>
      </section>

      <section className="magic-manifesto magic-shell">
        <div className="magic-manifesto__visual">
          <div className="magic-sun" aria-hidden="true" />
          <div className="magic-photo magic-photo--tilt magic-photo--product"><Image src={value('manifesto.image', '/images/produtos-reais/display-papeis-infantis.png')} alt="Produto Mundo Encantado" fill sizes="(max-width: 760px) 88vw, 38vw" /></div>
          <p className="magic-caption">Cada detalhe conta uma história.</p>
        </div>
        <div className="magic-manifesto__copy">
          <p className="magic-eyebrow magic-eyebrow--olive">{value('manifesto.eyebrow', 'Um presente antes mesmo de abrir')}</p>
          <h2><AccentTitle text={value('manifesto.title', 'Papel bonito. Afeto à vista.')} /></h2>
          <p>{value('manifesto.description', 'Transformamos o gesto de presentear em uma pequena celebração. Para o lojista, isso significa produto que chama atenção, cria desejo e deixa a escolha mais fácil.')}</p>
          <Link href="#colecoes" className="magic-link magic-link--dark">Descobrir as coleções <span>↓</span></Link>
        </div>
      </section>

      <section className="magic-collections" id="colecoes">
        <svg className="magic-wave magic-wave--top" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true"><path d="M0,82 C235,20 430,156 720,91 C1000,28 1180,146 1440,57 L1440,0 L0,0 Z" /></svg>
        <div className="magic-shell">
          <div className="magic-section-head"><div><p className="magic-eyebrow">Universos para descobrir</p><h2><AccentTitle text={value('collections.title', 'Qual história vai morar na sua loja?')} /></h2></div><p>{value('collections.description', 'Um mix versátil para diferentes ocasiões, idades e jeitos de presentear.')}</p></div>
          <div className="magic-collection-grid">
            <article className="magic-card magic-card--big magic-card--catalog"><Image src={value('collections.image', '/images/produtos-reais/linha-completa-mundo-encantado.png')} alt="Linha real Mundo Encantado" fill sizes="(max-width: 760px) 92vw, 54vw" /><div><small>01 — Carro-chefe</small><h3>Papéis de presente</h3><p>Cor, toque e estampas que viram parte do presente.</p></div></article>
            <article className="magic-card magic-card--yellow"><span className="magic-card__number">02</span><div><small>Prático e irresistível</small><h3>Kits prontos</h3><p>Papel, laço e cartão em uma solução que facilita a escolha.</p></div><Image src="/images/produtos-reais/kit-25x35-turma.png" alt="Kit Presente Encantado 25 por 35 centímetros, estampa Turma da Mônica" width={220} height={275} /></article>
            <article className="magic-card magic-card--cream"><span className="magic-card__number">03</span><div><small>Mais opções na gôndola</small><h3>Três formatos</h3><p>Tamanhos pensados para livros, camisas e presentes maiores.</p></div><Image src="/images/produtos-reais/kit-20x29-espaco.png" alt="Kit Presente Encantado 20 por 29 centímetros, estampa espacial" width={220} height={275} /></article>
          </div>
          <div className="magic-center"><Link className="magic-button magic-button--light" href="#catalogo-produtos">Ver coleção completa <span>↓</span></Link></div>
        </div>
      </section>

      <section className="magic-retail magic-shell" id="lojistas">
        <div className="magic-retail__intro"><p className="magic-eyebrow magic-eyebrow--olive">Bom para quem presenteia. Melhor para quem vende.</p><h2><AccentTitle text={value('retail.title', 'Um mix que chega pronto para girar.')} /></h2></div>
        <div className="magic-benefits">
          <article><span>01</span><h3>Exposição fácil</h3><p>Produtos organizados para ocupar bem a gôndola e chamar o olhar.</p></article>
          <article><span>02</span><h3>Mix inteligente</h3><p>Infantil, neutro e comemorativo para cobrir mais ocasiões de compra.</p></article>
          <article><span>03</span><h3>Direto da fábrica</h3><p>Atendimento comercial próximo e condições pensadas para o varejo.</p></article>
          <article><span>04</span><h3>Reposição simples</h3><p>Seu estoque renovado com agilidade para não perder venda.</p></article>
        </div>
        <div className="magic-retail__cta"><div><span>EXCLUSIVO PARA EMPRESAS</span><p>Quer comprar direto da fábrica?</p><small>Cadastre seu CNPJ e receba condições comerciais para a sua loja.</small></div><Link href="/cadastro" className="magic-button">Quero ser parceiro B2B <span>↗</span></Link></div>
      </section>

      <section className="magic-scale">
        <div className="magic-shell magic-scale__grid">
          <div className="magic-scale__image"><div className="magic-photo magic-photo--product"><Image src={value('scale.image', '/images/produtos-reais/linha-completa-mundo-encantado.png')} alt="Linha completa real de produtos Mundo Encantado" fill sizes="(max-width: 800px) 92vw, 48vw" /></div><span className="magic-floating-tag">feito aqui<br />com carinho ✦</span></div>
          <div><p className="magic-eyebrow">Estrutura que dá tranquilidade</p><h2>{value('scale.title', 'Da ideia à prateleira, cuidamos de tudo.')}</h2><p>{value('scale.description', 'Criação autoral, produção gráfica, controle de qualidade e expedição reunidos para atender sua loja de ponta a ponta.')}</p><div className="magic-stats"><div><strong>Brasil</strong><span>atendimento nacional</span></div><div><strong>3 linhas</strong><span>em um mix completo</span></div><div><strong>Direto</strong><span>com nosso comercial</span></div></div></div>
        </div>
      </section>

      <section className="magic-social magic-shell">
        <div className="magic-section-head"><div><p className="magic-eyebrow magic-eyebrow--olive">Nosso mundo continua por lá</p><h2>Inspiração que cabe<br />no seu feed.</h2></div><a className="magic-link magic-link--dark" href="https://instagram.com/mundoencantado.br" target="_blank" rel="noreferrer">Seguir @mundoencantado.br <span>↗</span></a></div>
        <div className="magic-social__grid">{['kit-30x44-rosa-frente.png','kit-25x35-turma.png','kit-20x29-espaco.png','display-papeis-premium.png'].map((src, i) => <a href="https://instagram.com/mundoencantado.br" target="_blank" rel="noreferrer" key={src} className={`magic-post magic-post--${i + 1}`}><Image src={`/images/produtos-reais/${src}`} alt="Produto real Mundo Encantado no Instagram" fill sizes="(max-width: 700px) 46vw, 23vw" /><span>↗</span></a>)}</div>
      </section>

      <section className="magic-final">
        <div className="magic-planet magic-planet--final" aria-hidden="true">
          <img src="/globo_logo_mundo_encantado.svg" alt="" />
        </div><Stars />
        <div className="magic-final__content"><p className="magic-eyebrow">Vamos crescer juntos?</p><h2><AccentTitle text={value('final.title', 'Leve um mundo de boas escolhas para a sua loja.')} /></h2><p>{value('final.description', 'Conheça todos os produtos e encontre o mix ideal para o seu negócio.')}</p><Link href="#catalogo-produtos" className="magic-button magic-button--light">Explorar catálogo <span>↓</span></Link></div>
      </section>
    </div>
  );
}

function AccentTitle({ text }: { text: string }) {
  const words = text.trim().split(/\s+/); const pivot = Math.max(1, Math.ceil(words.length / 2));
  return <>{words.slice(0, pivot).join(' ')}<br /><em>{words.slice(pivot).join(' ')}</em></>;
}
