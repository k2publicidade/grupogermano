'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type LogoProps = {
  inverse?: boolean;
  animated?: boolean;
};

export function Logo({ inverse = false, animated = false }: LogoProps) {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!animated || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let staticTimer: number | undefined;
    const playIntro = () => {
      setShowIntro(true);
      staticTimer = window.setTimeout(() => setShowIntro(false), 2900);
    };

    window.addEventListener('germano:preloader-complete', playIntro, { once: true });
    return () => {
      window.removeEventListener('germano:preloader-complete', playIntro);
      if (staticTimer) window.clearTimeout(staticTimer);
    };
  }, [animated]);

  const source = showIntro ? '/germano-logo-intro.svg' : '/germano-logo-static.svg';

  return <Link href="/" className={`logo ${inverse ? 'logo--inverse' : ''}`} aria-label="Grupo Germano, página inicial">
    <img src={source} alt="" aria-hidden="true" width="900" height="260" />
  </Link>;
}
