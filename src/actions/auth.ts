'use server';

import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SECRET_KEY = new TextEncoder().encode('my-secret-key-change-in-prod');

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Missing fields' };
  }

  // Check DB
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !user || !bcrypt.compareSync(password, user.password_hash)) {
    return { error: 'Invalid credentials' };
  }

  // Create JWT
  const token = await new SignJWT({ sub: user.id.toString(), username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SECRET_KEY);

  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  redirect('/admin/dashboard');
}

export async function logout() {
  (await cookies()).delete('session');
  redirect('/admin/login');
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, SECRET_KEY);
    return payload;
  } catch (e) {
    return null;
  }
}
