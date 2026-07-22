import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { LockIcon } from '@/components/icons';
import { QuoteBuilder } from './quote-builder';

export const metadata: Metadata = { title: 'Monte seu orçamento', description: 'Selecione produtos e quantidades para gerar uma proposta comercial Grupo Germano.' };
export const dynamic = 'force-dynamic';

export default async function QuotePage() {
  const cookieStore = await cookies();
  const complete = cookieStore.get('cadastro_b2b_completo')?.value === 'sim';
  return <><section className="page-hero"><div className="shell"><p className="section-note">ORÇAMENTO B2B</p><h1>Monte seu pedido de forma simples.</h1><p>Selecione os produtos e ajuste as quantidades. Nossa equipe entrará em contato para continuar o atendimento.</p></div></section><section className="section shell">{complete ? <QuoteBuilder /> : <div className="download-gate"><div className="success-state"><span className="success-icon"><LockIcon /></span><h2>Acesso exclusivo para cadastro completo.</h2><p>Complete os dados da sua empresa para acessar as ferramentas de orçamento e os materiais exclusivos.</p><Link href="/cadastro?nivel=completo" className="button button--dark">Completar cadastro</Link></div></div>}</section></>;
}
