import { MundoEncantadoHeader } from '@/components/mundo-encantado-header';
import { MundoEncantadoFooter } from '@/components/mundo-encantado-footer';
import { Preloader } from '@/components/preloader';

export default function MundoEncantadoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mundo-encantado-theme bg-cream-texture">
      <Preloader />
      <MundoEncantadoHeader />
      <main>{children}</main>
      <MundoEncantadoFooter />
    </div>
  );
}
