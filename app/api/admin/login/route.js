import { NextResponse } from 'next/server';

export async function POST(req) {
  const { username, password } = await req.json();
  
  if (
    username === process.env.ADMIN_PAGE_USER &&
    password === process.env.ADMIN_PAGE_PASS
  ) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_session', 'ok', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 4, // 4 hours
    });
    return res;
  }
  
  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}
