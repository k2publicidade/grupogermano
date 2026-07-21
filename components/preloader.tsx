'use client';

import { useEffect, useState } from 'react';

const INTRO_DURATION = 3000;
const EXIT_DURATION = 450;

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(reduceMotion);
    document.documentElement.classList.add('is-preloading');

    const introTimer = window.setTimeout(() => {
      setExiting(true);
      window.dispatchEvent(new Event('germano:preloader-complete'));
    }, reduceMotion ? 150 : INTRO_DURATION);

    const removeTimer = window.setTimeout(() => {
      setVisible(false);
      document.documentElement.classList.remove('is-preloading');
    }, (reduceMotion ? 150 : INTRO_DURATION) + EXIT_DURATION);

    return () => {
      window.clearTimeout(introTimer);
      window.clearTimeout(removeTimer);
      document.documentElement.classList.remove('is-preloading');
    };
  }, []);

  if (!visible) return null;

  return <div className={`preloader ${exiting ? 'preloader--exit' : ''}`} role="status" aria-live="polite" aria-label="Carregando o site do Grupo Germano">
    <picture>
      <source media="(prefers-reduced-motion: reduce)" srcSet="/germano-logo-static.svg" />
      <img
        className="preloader__logo"
        src="/germano-logo-loader.svg"
        alt=""
        aria-hidden="true"
        width="1600"
        height="900"
      />
    </picture>
    <span className="sr-only">Carregando</span>
  </div>;
}
