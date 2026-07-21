import Link from 'next/link';

export function MundoEncantadoFooter() {
  return (
    <footer className="footer footer--me bg-cosmic-texture">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <Link href="/catalogo" className="logo-me logo-me--inverse" style={{ marginBottom: '1rem' }}>
              <img src="/logo_mundo_encantado.svg" alt="Mundo Encantado Logo" className="logo-me__image" />
            </Link>
            <p style={{ maxWidth: '280px', fontSize: '0.88rem' }}>
              Transformamos presentes em momentos inesquecíveis através de design autoral, acabamento primoroso e compromisso comercial.
            </p>
          </div>

          <div>
            <h4 style={{ font: '700 0.72rem Arial, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Marca</h4>
            <nav style={{ display: 'grid', gap: '0.65rem' }}>
              <Link href="/catalogo">Início</Link>
              <Link href="/mundo-encantado/sobre">Sobre nós</Link>
              <Link href="/catalogo">Catálogo de Produtos</Link>
              <Link href="/mundo-encantado/download">Baixar Catálogo PDF</Link>
            </nav>
          </div>

          <div>
            <h4 style={{ font: '700 0.72rem Arial, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Parceiros B2B</h4>
            <nav style={{ display: 'grid', gap: '0.65rem' }}>
              <Link href="/mundo-encantado/revendedor">Seja um Revendedor</Link>
              <Link href="/cadastro">Fazer Cadastro</Link>
              <Link href="/orcamento">Montar Orçamento B2B</Link>
            </nav>
          </div>

          <div>
            <h4 style={{ font: '700 0.72rem Arial, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Contato Oficial</h4>
            <nav style={{ display: 'grid', gap: '0.65rem' }}>
              <a href="https://wa.me/5521964249896" target="_blank" rel="noopener noreferrer">WhatsApp: (21) 96424-9896</a>
              <a href="https://instagram.com/mundoencantado.br" target="_blank" rel="noopener noreferrer">Instagram: @mundoencantado.br</a>
              <a href="mailto:comercial@grupogermano.com.br">comercial@grupogermano.com.br</a>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Mundo Encantado. Todos os direitos reservados. Uma marca do Grupo Germano.</span>
          <span>Desenvolvido com excelência para lojistas do Brasil.</span>
        </div>
      </div>
    </footer>
  );
}
