'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { DownloadIcon, MinusIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { products as seedProducts, type Product } from '@/lib/data';

type Cart = Record<string, number>;
type QuoteResult = { ok: boolean; whatsappUrl?: string; error?: string };

export function QuoteBuilder() {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [cart, setCart] = useState<Cart>({ '1': 100, '2': 60 });
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/cms', { cache: 'no-store' }).then((response) => response.json()).then((data) => {
      if (data.products?.length) {
        const loadedProducts = data.products as Product[];
        setProducts(loadedProducts);
        setCart(Object.fromEntries(
          loadedProducts.slice(0, 2).map((product) => [product.id, product.minOrder]),
        ));
      }
    }).catch(() => null);
  }, []);

  useEffect(() => {
    if (!showLeadForm) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setShowLeadForm(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [showLeadForm]);

  const rows = products
    .filter((product) => cart[product.id])
    .map((product) => ({ product, quantity: cart[product.id] }));

  function update(id: string, quantity: number) {
    const product = products.find((item) => item.id === id)!;
    setCart((current) => ({ ...current, [id]: Math.max(product.minOrder, quantity) }));
  }

  function add(id: string) {
    const product = products.find((item) => item.id === id)!;
    setCart((current) => ({ ...current, [id]: current[id] || product.minOrder }));
  }

  async function generateQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: Object.fromEntries(new FormData(event.currentTarget).entries()),
          items: rows.map(({ product, quantity }) => ({
            product: { id: product.id },
            quantity,
          })),
        }),
      });
      const result = await response.json() as QuoteResult;
      if (!response.ok || !result.ok) throw new Error(result.error);
      setShowLeadForm(false);
      if (result.whatsappUrl) window.location.assign(result.whatsappUrl);
    } catch {
      setError('Não foi possível gerar o orçamento agora. Confira os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return <>
    <div className="quote-layout">
      <section className="quote-products">
        <div className="quote-heading">
          <div><p className="section-note">SEU PEDIDO</p><h2>Produtos e quantidades</h2></div>
          <span>{rows.length} itens</span>
        </div>
        {products.map((product) => cart[product.id] ? (
          <article className="quote-row" key={product.id}>
            <Image src={product.image} alt="" width={120} height={120} />
            <div className="quote-row__product">
              <span>{product.sku}</span><strong>{product.name}</strong><small>mín. {product.minOrder} {product.unit}</small>
            </div>
            <div className="qty-control">
              <button onClick={() => update(product.id, cart[product.id] - product.minOrder)} aria-label={`Diminuir ${product.name}`}><MinusIcon /></button>
              <input aria-label={`Quantidade de ${product.name}`} type="number" value={cart[product.id]} min={product.minOrder} step={product.minOrder} onChange={(event) => update(product.id, Number(event.target.value))} />
              <button onClick={() => update(product.id, cart[product.id] + product.minOrder)} aria-label={`Aumentar ${product.name}`}><PlusIcon /></button>
            </div>
            <button className="icon-button" onClick={() => setCart((current) => { const next = { ...current }; delete next[product.id]; return next; })} aria-label={`Remover ${product.name}`}><TrashIcon /></button>
          </article>
        ) : (
          <article className="available-row" key={product.id}>
            <div><strong>{product.name}</strong><span>{product.category}</span></div>
            <button onClick={() => add(product.id)} className="button button--outline button--compact"><PlusIcon /> Adicionar</button>
          </article>
        ))}
      </section>
      <aside className="quote-summary">
        <p className="section-note">RESUMO</p><h2>Seu orçamento</h2>
        <div className="summary-lines">{rows.map((row) => <div key={row.product.id}><span>{row.product.shortName} × {row.quantity}</span></div>)}</div>
        <div className="volume-tip"><strong>Atendimento personalizado</strong><p>Nosso time entrará em contato para apresentar as condições comerciais do pedido.</p></div>
        <button className="button button--dark button--full" disabled={!rows.length} onClick={() => setShowLeadForm(true)}><DownloadIcon /> Gerar orçamento</button>
        <p className="summary-note">Cadastre seus dados para receber o orçamento e continuar o atendimento pelo WhatsApp.</p>
      </aside>
    </div>
    {showLeadForm && <div className="quote-modal-backdrop" onMouseDown={() => setShowLeadForm(false)}><div className="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-lead-title" onMouseDown={(event) => event.stopPropagation()}><button className="quote-modal__close" type="button" onClick={() => setShowLeadForm(false)} aria-label="Fechar">×</button><p className="section-note">FALTA POUCO</p><h2 id="quote-lead-title">Para quem devemos enviar o orçamento?</h2><p className="quote-modal__intro">Preencha seus dados para receber a proposta por e-mail e continuar o pedido com nosso time no WhatsApp.</p><form onSubmit={generateQuote}><div className="form-grid form-grid--2"><div className="field"><label htmlFor="quote-name">Seu nome</label><input id="quote-name" name="name" required autoComplete="name" autoFocus /></div><div className="field"><label htmlFor="quote-company">Empresa</label><input id="quote-company" name="company" required autoComplete="organization" /></div></div><div className="form-grid form-grid--2"><div className="field"><label htmlFor="quote-email">E-mail</label><input id="quote-email" name="email" type="email" required autoComplete="email" /></div><div className="field"><label htmlFor="quote-phone">WhatsApp</label><input id="quote-phone" name="phone" type="tel" required autoComplete="tel" placeholder="(00) 00000-0000" /></div></div><label className="checkbox"><input name="consent" value="accepted" type="checkbox" required /><span>Autorizo o contato comercial por e-mail e WhatsApp para atendimento deste orçamento.</span></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button--dark button--full" disabled={loading}>{loading ? 'Gerando orçamento…' : 'Receber orçamento e continuar no WhatsApp'}</button><small className="quote-modal__privacy">Seus dados serão usados somente para este atendimento comercial.</small></form></div></div>}
  </>;
}
