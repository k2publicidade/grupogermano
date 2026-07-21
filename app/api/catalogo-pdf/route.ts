import { promises as fs } from 'node:fs';
import path from 'node:path';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get('catalogo_liberado')?.value !== 'sim') {
    return NextResponse.redirect(new URL('/mundo-encantado/download', request.url));
  }

  try {
    const filePath = path.join(process.cwd(), 'private', 'catalogo-mundo-encantado.pdf');
    const file = await fs.readFile(filePath);

    return new NextResponse(file, {
      headers: {
        'Cache-Control': 'private, no-store',
        'Content-Disposition': 'attachment; filename="catalogo-mundo-encantado-2026.pdf"',
        'Content-Type': 'application/pdf',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Catálogo temporariamente indisponível.' }, { status: 503 });
  }
}
