import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://grupogermano.app.br'),
  title: { default: 'Grupo Germano | Papelaria que encanta e vende', template: '%s | Grupo Germano' },
  description: 'Desenvolvimento de produtos de papelaria para lojistas e revendedores. Conheça a linha Mundo Encantado e solicite seu orçamento B2B.',
  openGraph: { title: 'Grupo Germano', description: 'Papelaria que encanta e vende.', type: 'website', locale: 'pt_BR', images: ['/images/produtos-reais/linha-completa-mundo-encantado.png'] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
