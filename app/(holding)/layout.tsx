import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Preloader } from '@/components/preloader';

export default function HoldingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Preloader />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
