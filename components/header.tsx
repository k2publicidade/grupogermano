'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CloseIcon, MenuIcon } from './icons';
import { Logo } from './logo';

const links = [
  { href: '/#quem-somos', label: 'Grupo' },
  { href: '/#competencias', label: 'Atuação' },
  { href: '/#estrutura', label: 'Estrutura' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  return <header className="site-header germano-header">
    <div className="shell header-inner">
      <Logo animated />
      <nav className="desktop-nav" aria-label="Navegação principal">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}<Link href="/#marcas" className="germano-header__brand-cta"><span aria-hidden="true">✦</span> Mundo Encantado</Link></nav>
      <div className="header-actions">
        <Link href="/#contato" className="germano-header__contact">Fale conosco <span>↗</span></Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Fechar menu' : 'Abrir menu'}>{open ? <CloseIcon /> : <MenuIcon />}</button>
      </div>
    </div>
    {open && <nav id="mobile-nav" className="mobile-nav germano-mobile-nav" aria-label="Navegação móvel">
      <small>Menu</small>{links.map((link, index) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{link.label}</Link>)}
      <Link href="/#marcas" className="germano-mobile-nav__brand" onClick={() => setOpen(false)}><span>04</span><strong>Mundo Encantado</strong><i>Conhecer a marca ↗</i></Link>
      <Link href="/#contato" onClick={() => setOpen(false)}><span>05</span>Contato</Link>
    </nav>}
  </header>;
}
