export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortName: string;
  description: string;
  image: string;
  sku: string;
  minOrder: number;
  unit: string;
  stock: number;
  featured: boolean;
  active?: boolean;
  tags: string[];
  specifications: { label: string; value: string }[];
  tiers: { min: number; price: number }[];
};

export const products: Product[] = [
  {
    id: '1', slug: 'kit-presente-encantado-20x29', name: 'Kit Presente Encantado 20 × 29 cm', shortName: 'Kit 20 × 29', category: 'Kits para presente',
    description: 'Kit compacto com três sacos de presente, três laços prontos e três cartões de/para, em estampa espacial autoral.',
    image: '/images/produtos-reais/kit-20x29-espaco.png', sku: 'ME-KP-02029', minOrder: 48, unit: 'kits', stock: 2400, featured: true,
    tags: ['Kit', 'Espacial', 'Pronto para venda'],
    specifications: [{ label: 'Formato', value: '20 × 29 cm' }, { label: 'Conteúdo', value: '3 sacos + 3 laços + 3 cartões' }, { label: 'Uso', value: 'Cabe um livro' }],
    tiers: [{ min: 100, price: 3.9 }, { min: 500, price: 3.4 }, { min: 1000, price: 2.95 }],
  },
  {
    id: '2', slug: 'rolo-papel-de-presente', name: 'Rolo de papel de presente', shortName: 'Presentear', category: 'Papéis de presente',
    description: 'Papel de presente com impressão nítida, boa gramatura e estampas autorais da linha Mundo Encantado.',
    image: '/images/produtos-reais/display-papeis-infantis.png', sku: 'ME-PP-015', minOrder: 60, unit: 'rolos', stock: 1850, featured: true,
    tags: ['Presente', 'Estampado', 'Atacado'],
    specifications: [{ label: 'Dimensão', value: '60 cm × 2 m' }, { label: 'Papel', value: 'Couchê 70 g/m²' }, { label: 'Embalagem', value: 'Filme protetor' }],
    tiers: [{ min: 60, price: 6.8 }, { min: 300, price: 5.95 }, { min: 600, price: 5.4 }],
  },
  {
    id: '3', slug: 'kit-presente-encantado-30x44', name: 'Kit Presente Encantado 30 × 44 cm', shortName: 'Kit 30 × 44', category: 'Kits para presente',
    description: 'Solução pronta para o ponto de venda com saco de presente, laço dourado e cartão de/para em embalagem organizada.',
    image: '/images/produtos-reais/kit-30x44-rosa-frente.png', sku: 'ME-KP-3044', minOrder: 48, unit: 'kits', stock: 920, featured: true,
    tags: ['Kit', 'Presente', 'Pronto para venda'],
    specifications: [{ label: 'Formato', value: '30 × 44 cm' }, { label: 'Conteúdo', value: '1 saco + 1 laço + 1 cartão' }, { label: 'Uso', value: 'Cabe uma camisa' }],
    tiers: [{ min: 48, price: 9.9 }, { min: 240, price: 8.75 }, { min: 480, price: 7.95 }],
  },
  {
    id: 'ME25001', slug: 'display-papel-de-presente-infantil', name: 'Display de Papel de Presente — Infantil', shortName: 'Display Infantil', category: 'Papéis de presente',
    description: 'Display expositor para ponto de venda com 156 rolos de papel de presente, contendo estampas lúdicas e coloridas da linha Infantil.',
    image: '/images/produtos-reais/display-papeis-infantis.png', sku: 'ME25001', minOrder: 1, unit: 'display', stock: 0, featured: true, active: true,
    tags: ['Display', 'Papel de presente', 'Infantil', 'Atacado'],
    specifications: [
      { label: 'Formato do papel', value: '100 × 70 cm' },
      { label: 'Gramatura', value: '80 g/m²' },
      { label: 'Apresentação', value: 'Display com 156 rolos' },
      { label: 'Dimensões do display', value: '39 × 39 × 50 cm' },
      { label: 'Linha', value: 'Infantil' },
      { label: 'EAN-13', value: '7898973004056' },
      { label: 'Caixa master', value: '1 display' }
    ],
    tiers: [{ min: 1, price: 0 }],
  },
  {
    id: 'ME25002', slug: 'display-papel-de-presente-casual', name: 'Display de Papel de Presente — Casual', shortName: 'Display Casual', category: 'Papéis de presente',
    description: 'Display expositor para ponto de venda com 156 rolos de papel de presente, contendo estampas modernas e versáteis da linha Adulto / Casual.',
    image: '/images/produtos-reais/display-papeis-premium.png', sku: 'ME25002', minOrder: 1, unit: 'display', stock: 0, featured: true, active: true,
    tags: ['Display', 'Papel de presente', 'Casual', 'Atacado'],
    specifications: [
      { label: 'Formato do papel', value: '100 × 70 cm' },
      { label: 'Gramatura', value: '80 g/m²' },
      { label: 'Apresentação', value: 'Display com 156 rolos' },
      { label: 'Dimensões do display', value: '39 × 39 × 50 cm' },
      { label: 'Linha', value: 'Adulto / Casual' },
      { label: 'EAN-13', value: '7898973004063' },
      { label: 'Caixa master', value: '1 display' }
    ],
    tiers: [{ min: 1, price: 0 }],
  },
];

export const formatMoney = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function priceFor(product: Product, quantity: number) {
  return [...product.tiers].reverse().find((tier) => quantity >= tier.min)?.price ?? product.tiers[0].price;
}
