import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const CMS_COOKIE = 'me_admin_session';
const lifetime = 60 * 60 * 8;

function secret() { return process.env.ADMIN_SESSION_SECRET ?? ''; }
function signature(value: string) { return createHmac('sha256', secret()).update(value).digest('hex'); }

export function validateCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL ?? '';
  const expectedHash = process.env.ADMIN_PASSWORD_HASH ?? '';
  const receivedHash = createHash('sha256').update(password).digest('hex');
  if (!expectedEmail || !expectedHash || email.toLowerCase() !== expectedEmail.toLowerCase()) return false;
  return timingSafeEqual(Buffer.from(receivedHash), Buffer.from(expectedHash));
}

export function createSession() {
  const expires = Math.floor(Date.now() / 1000) + lifetime;
  const payload = Buffer.from(JSON.stringify({ role: 'admin', expires })).toString('base64url');
  return `${payload}.${signature(payload)}`;
}

export function verifySession(token?: string) {
  if (!token || !secret()) return false;
  const [payload, supplied] = token.split('.');
  if (!payload || !supplied) return false;
  const expected = signature(payload);
  if (supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).expires > Date.now() / 1000; } catch { return false; }
}

export async function isAdmin() {
  return verifySession((await cookies()).get(CMS_COOKIE)?.value);
}

export const sessionMaxAge = lifetime;
