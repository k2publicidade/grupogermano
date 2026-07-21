import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/data';
import { ArrowIcon, LockIcon } from './icons';

export function ProductCard({ product }: { product: Product }) {
  return <article className="product-card">
    <Link href={`/catalogo/mundo-encantado/${product.slug}`} className="product-card__image"><Image src={product.image} alt={`${product.name} da linha Mundo Encantado`} width={800} height={800} sizes="(max-width: 720px) 100vw, 33vw" /></Link>
    <div className="product-card__body">
      <div className="product-card__meta"><span>{product.category}</span><span>{product.sku}</span></div>
      <h3><Link href={`/catalogo/mundo-encantado/${product.slug}`}>{product.name}</Link></h3>
      <p>{product.description}</p>
      <Link href={`/catalogo/mundo-encantado/${product.slug}`} className="product-card__action"><span className="locked-price"><LockIcon /> Preço após cadastro</span><ArrowIcon /></Link>
    </div>
  </article>;
}

