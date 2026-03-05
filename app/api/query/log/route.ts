import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase';

interface LogQueryBody {
  query: string;
  mode: string;
  personality: string;
  result: {
    engineScore: number;
    solveTime: number;
    modelsUsed: string[];
    soloBenchmarks: { model: string; score: number }[];
  };
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;
  const body: LogQueryBody = await req.json();
  const { query, mode, personality, result } = body;

  // Insert the query log row
  const { error: insertError } = await supabaseAdmin.from('queries').insert({
    user_email: email,
    query,
    mode,
    personality,
    engine_score: result.engineScore ?? null,
    solve_time_ms: result.solveTime ?? null,
    models_used: result.modelsUsed ?? [],
    solo_benchmarks: result.soloBenchmarks ?? [],
  });

  if (insertError) {
    console.error('[query/log] Insert error:', insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Increment queries_used
  const { data: user, error: updateError } = await supabaseAdmin.rpc('increment_queries_used', {
    user_email: email,
  });

  if (updateError) {
    // Fallback: manual increment if RPC doesn't exist yet
    const { data: current } = await supabaseAdmin
      .from('users')
      .select('queries_used')
      .eq('email', email)
      .single();

    await supabaseAdmin
      .from('users')
      .update({ queries_used: (current?.queries_used ?? 0) + 1 })
      .eq('email', email);
  }

  // Return updated counts
  const { data: updatedUser } = await supabaseAdmin
    .from('users')
    .select('queries_used, queries_limit, tier')
    .eq('email', email)
    .single();

  return NextResponse.json({
    queries_used: updatedUser?.queries_used ?? 0,
    queries_limit: updatedUser?.queries_limit ?? 5,
    tier: updatedUser?.tier ?? 'free',
  });
}
