import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowIcon, CheckIcon } from '@/components/icons';
import { readCms } from '@/lib/cms/store';
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = (await readCms()).products.find((p) => p.slug === slug && p.active !== false);
  return {
    title: product?.name ?? 'Produto',
    description: product?.description
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = (await readCms()).products.find((item) => item.slug === slug && item.active !== false);
  if (!p) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: `https://grupogermano.app.br${p.image}`,
    sku: p.sku,
    brand: {
      '@type': 'Brand',
      name: 'Mundo Encantado'
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="product-detail shell">
        <div className="product-detail__image">
          <Image src={p.image} alt={p.name} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
        <div className="product-detail__info">
          <div className="breadcrumbs">
            <Link href="/catalogo/mundo-encantado">Catálogo</Link>
            <span>/</span>
            <span>{p.category}</span>
          </div>
          <div>
            <span className="badge">{p.category}</span>
            <h1 className="title-me" style={{ marginTop: '0.8rem', marginBottom: '1.2rem' }}>{p.name}</h1>
            <p className="lead">{p.description}</p>
          </div>
          
          <div className="private-price">
            <div>
              <strong>Atendimento comercial B2B</strong>
              <span>Cadastre sua empresa para receber disponibilidade e condições comerciais.</span>
            </div>
          </div>
          
          <div className="spec-list">
            {p.specifications.map((s) => (
              <div key={s.label}>
                <span>{s.label}</span>
                <strong>{s.value}</strong>
              </div>
            ))}
            <div>
              <span>Pedido mínimo</span>
              <strong>{p.minOrder} {p.unit}</strong>
            </div>
          </div>
          
          <div className="detail-actions">
            <Link href={`/cadastro?produto=${p.slug}`} className="button button--me-primary">
              Solicitar atendimento <ArrowIcon />
            </Link>
            <Link href={`/orcamento?produto=${p.slug}`} className="button button--outline" style={{ borderColor: 'var(--black)' }}>
              Adicionar ao Orçamento
            </Link>
          </div>
          <p className="detail-note">
            <CheckIcon /> Estoque e condições são validados no momento da proposta.
          </p>
        </div>
      </section>
    </>
  );
}
