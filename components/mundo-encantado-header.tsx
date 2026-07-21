'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CloseIcon, MenuIcon, DownloadIcon } from './icons';

const links = [
  { href: '/catalogo#marca', label: 'A marca' },
  { href: '/catalogo#colecoes', label: 'Coleções' },
  { href: '/catalogo#lojistas', label: 'Para lojistas' },
  { href: '/catalogo#catalogo-produtos', label: 'Produtos' },
  { href: '/cadastro', label: 'Cadastro B2B', featured: true },
];

export function MundoEncantadoHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header site-header--me">
      <div className="shell header-inner">
        <Link href="/catalogo" className="logo-me" aria-label="Mundo Encantado, catálogo">
          <img src="/logo_mundo_encantado_dark.svg" alt="Mundo Encantado Logo" className="logo-me__image" />
        </Link>

        <nav className="desktop-nav desktop-nav--me" aria-label="Navegação principal da marca">
          {links.map((link) => (
            <Link 
              key={link.href} 
              className={[
                pathname === '/catalogo' && link.href.endsWith('#catalogo-produtos') ? 'active' : '',
                pathname === link.href ? 'active' : '',
                link.featured ? 'desktop-nav__featured' : '',
              ].filter(Boolean).join(' ')}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/mundo-encantado/download" className="button button--me-primary button--compact">
            <DownloadIcon /> Catálogo PDF
          </Link>
          <button 
            className="menu-button" 
            onClick={() => setOpen(!open)} 
            aria-expanded={open} 
            aria-controls="mobile-nav-me" 
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav-me" className="mobile-nav mobile-nav--me" aria-label="Navegação móvel da marca">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={link.featured ? 'mobile-nav__featured' : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/mundo-encantado/download" className="button button--me-primary" onClick={() => setOpen(false)}>
            Baixar Catálogo PDF
          </Link>
        </nav>
      )}
    </header>
  );
}
