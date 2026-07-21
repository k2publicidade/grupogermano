import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { MagicalHome } from '@/components/magical-home';
import { readCms } from '@/lib/cms/store';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mundo Encantado | Catálogo de Produtos',
  description: 'Conheça a linha Mundo Encantado para lojistas e revendedores B2B.',
  alternates: { canonical: '/catalogo' },
};

export default async function CatalogPage() {
  const cms = await readCms();
  const products = cms.products.filter((product) => product.active !== false);

  return (
    <>
      <MagicalHome />

      <section className="catalog-showcase" id="catalogo-produtos" aria-labelledby="catalogo-title">
        <div className="shell catalog-showcase__intro">
          <p className="section-note section-note--me">CATÁLOGO COMPLETO · MUNDO ENCANTADO B2B</p>
          <div className="catalog-showcase__heading">
            <h2 id="catalogo-title">Escolha os produtos que vão encantar a sua loja.</h2>
            <p>
              Explore a linha completa, conheça formatos e estampas e encontre o mix ideal para o seu ponto de venda. Valores e condições comerciais são apresentados pelo nosso time.
            </p>
          </div>
          <div className="catalog-showcase__guide" aria-label="Como comprar">
            <span><b>01</b> Explore a coleção</span>
            <span><b>02</b> Selecione os produtos</span>
            <span><b>03</b> Solicite sua proposta</span>
          </div>
        </div>

        <div className="section shell catalog-showcase__products">
        <div className="catalog-toolbar">
          <div>
            <strong>{products.length} produtos</strong>
            <span> disponíveis para proposta comercial</span>
          </div>
          {/* <Link href="/mundo-encantado/download" className="button button--me-outline">Baixar catálogo em PDF</Link> */}
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
        </div>
      </section>
    </>
  );
}
