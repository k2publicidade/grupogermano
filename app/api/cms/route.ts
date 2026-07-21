import { NextResponse } from 'next/server';
import { readCms } from '@/lib/cms/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cms = await readCms();
  return NextResponse.json({
    content: cms.content.filter((item) => item.status === 'published'),
    media: cms.media,
    products: cms.products.filter((product) => product.active !== false),
  }, { headers: { 'Cache-Control': 'no-store' } });
}
