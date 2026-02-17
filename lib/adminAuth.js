import { cookies } from 'next/headers';

export function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session');
  if (!token || token.value !== 'ok') {
    throw new Error('UNAUTH');
  }
}

export function isAdminAuthenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session');
  return token && token.value === 'ok';
}
