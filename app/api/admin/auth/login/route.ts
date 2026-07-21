import { NextResponse } from 'next/server';
import { CMS_COOKIE, createSession, sessionMaxAge, validateCredentials } from '@/lib/cms/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({ email: '', password: '' }));
  if (!validateCredentials(String(email), String(password))) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CMS_COOKIE, createSession(), { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: sessionMaxAge });
  return response;
}
