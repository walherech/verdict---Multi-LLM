import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { orchestrate } from '@/lib/engine/orchestrator';

export async function POST(request: Request) {
  try {
    // --- Auth & tier enforcement ---
    const session = await getServerSession();
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userRecord, error: userError } = await supabaseAdmin
      .from('users')
      .select('tier, queries_used, queries_limit')
      .eq('email', session.user.email)
      .single();

    if (userError || !userRecord) {
      return Response.json({ error: 'User record not found' }, { status: 403 });
    }

    if (userRecord.queries_used >= userRecord.queries_limit) {
      return Response.json(
        { error: 'Query limit reached. Upgrade to continue.' },
        { status: 403 }
      );
    }

    const tier: string = userRecord.tier ?? 'free';

    // --- Parse body ---
    const body = await request.json();
    const problem =
      typeof body?.problem === 'string' ? body.problem.trim() : '';

    // Personality: free tier may only use "clean"
    let personality: 'savage' | 'cocky' | 'clean' =
      body?.personality === 'savage' || body?.personality === 'cocky' || body?.personality === 'clean'
        ? body.personality
        : 'cocky';
    if (tier === 'free' && (personality === 'savage' || personality === 'cocky')) {
      personality = 'clean';
    }

    // Mode: deep is pro/max only
    let mode: 'quick' | 'deep' =
      body?.mode === 'quick' || body?.mode === 'deep' ? body.mode : 'deep';
    if (tier === 'free' || tier === 'basic') {
      mode = 'quick';
    }

    const showScores = typeof body?.showScores === 'boolean' ? body.showScores : true;

    if (!problem) {
      return Response.json(
        { error: 'Problem description is required' },
        { status: 400 }
      );
    }

    const result = await orchestrate(problem, personality, mode, showScores);

    return Response.json({
      solution: result.answer,
      research: result.byModel.research ?? '',
      analysis: result.byModel.analysis ?? '',
      synthesis: result.byModel.synthesis ?? '',
      critique: result.byModel.critique ?? '',
      solveTime: result.solveTimeSeconds,
      iterations: result.iterations,
      quality: result.quality,
      modelsUsed: result.modelsUsed,
      chainLog: result.chainLog,
      meta: {
        promptType: result.promptType,
        modelsUsed: result.modelsUsed,
        totalModelsRun: result.totalModelsRun,
        timing: result.timing,
        engineScore: result.engineScore,
        soloBenchmarks: result.soloBenchmarks,
        chainLog: result.chainLog,
        commentary: result.commentary,
        engineCommentary: result.engineCommentary,
        disclaimer: result.disclaimer,
        personality: result.personality,
        soloCommentary: result.soloCommentary,
        mode: result.mode,
        showScores: result.showScores,
      },
    });
  } catch (error) {
    console.error('[API /solve] Error:', error);
    const message =
      error instanceof Error ? error.message : 'Something went wrong. Please try again.';
    return Response.json({ error: message }, { status: 500 });
  }
}
