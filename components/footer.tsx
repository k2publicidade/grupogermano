import Link from 'next/link';
import { Logo } from './logo';

export function Footer() {
  return <footer className="footer germano-footer">
    <div className="shell germano-footer__top"><Logo inverse /><p>Marcas, produtos e soluções<br />para o varejo brasileiro.</p><a href="/#contato">Começar uma conversa <span>↗</span></a></div>
    <div className="shell germano-footer__nav">
      <div><strong>Navegação</strong><Link href="/#quem-somos">O Grupo</Link><Link href="/#competencias">Atuação</Link><Link href="/#marcas">Marcas</Link><Link href="/#estrutura">Estrutura</Link></div>
      <div><strong>Contato</strong><a href="mailto:contato@grupogermano.com.br">contato@grupogermano.com.br</a><a href="https://wa.me/5521964249896">+55 21 96424-9896</a><span>Rio de Janeiro · Brasil</span></div>
      <div><strong>Marca do grupo</strong><Link href="/mundo-encantado">Mundo Encantado ↗</Link></div>
    </div>
    <div className="shell germano-footer__bottom"><span>© {new Date().getFullYear()} Grupo Germano</span><span>Todos os direitos reservados</span><Link href="/admin">Acesso interno</Link></div>
  </footer>;
}
