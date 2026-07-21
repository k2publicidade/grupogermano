import { permanentRedirect } from 'next/navigation';

export default function LegacyCatalogPage() {
  permanentRedirect('/catalogo');
}
