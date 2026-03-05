import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email, name, image } = session.user;

  // Insert new user with defaults — silently no-ops if email already exists
  await supabaseAdmin.from('users').insert({
    email,
    name: name ?? null,
    image: image ?? null,
    tier: 'free',
    queries_used: 0,
    queries_limit: 5,
  }).select().maybeSingle();
  // We intentionally ignore the error here (duplicate key = existing user)

  // Always sync latest profile info from Google without touching tier/queries
  await supabaseAdmin
    .from('users')
    .update({ name: name ?? null, image: image ?? null, updated_at: new Date().toISOString() })
    .eq('email', email);

  // Return the authoritative record
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('email, name, image, tier, queries_used, queries_limit, created_at')
    .eq('email', email)
    .single();

  if (error) {
    console.error('[user/sync] Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
