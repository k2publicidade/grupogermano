import Link from 'next/link';
import { cookies } from 'next/headers';
import { CheckIcon, DownloadIcon, LockIcon } from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function DownloadPage() {
  const cookieStore = await cookies();
  const complete = cookieStore.get('cadastro_b2b_completo')?.value === 'sim';
  return <><section className="page-hero page-hero--me"><div className="shell"><p className="section-note section-note--me">DOWNLOAD DO CATÁLOGO</p><h1 className="title-me">Coleção digital Mundo Encantado</h1><p className="lead-me" style={{ maxWidth: '650px' }}>O catálogo e os materiais exclusivos estão disponíveis para empresas com cadastro B2Business completo.</p></div></section><section className="section shell"><div className="download-gate">{complete ? <div className="success-state"><span className="success-icon"><CheckIcon /></span><h2>Cadastro completo confirmado.</h2><p>Seu acesso está liberado. Clique abaixo para baixar o catálogo em PDF.</p><a href="/api/catalogo-pdf" download className="button button--me-primary"><DownloadIcon /> Baixar catálogo 2026</a></div> : <div className="success-state"><span className="success-icon"><LockIcon /></span><h2>Complete seu cadastro para continuar.</h2><p>O cadastro básico registra sua empresa, mas não libera downloads. Informe os dados empresariais completos, incluindo a inscrição estadual, para acessar o arquivo.</p><Link href="/cadastro?nivel=completo" className="button button--dark">Fazer cadastro completo</Link></div>}</div></section></>;
}
