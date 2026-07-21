import type { Metadata } from 'next';
import { QuoteBuilder } from './quote-builder';
export const metadata: Metadata = { title: 'Monte seu orçamento', description: 'Selecione produtos e quantidades para gerar uma proposta comercial Grupo Germano.' };
export default function QuotePage() { return <><section className="page-hero"><div className="shell"><p className="section-note">ORÇAMENTO B2B</p><h1>Monte seu pedido de forma simples.</h1><p>Selecione os produtos e ajuste as quantidades. Nossa equipe entrará em contato para continuar o atendimento.</p></div></section><section className="section shell"><QuoteBuilder /></section></>; }
