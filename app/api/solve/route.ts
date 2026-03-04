import { orchestrate } from '@/lib/engine/orchestrator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const problem =
      typeof body?.problem === 'string' ? body.problem.trim() : '';
    const personality =
      body?.personality === 'savage' || body?.personality === 'cocky' || body?.personality === 'clean'
        ? body.personality
        : 'cocky';
    const mode = body?.mode === 'quick' || body?.mode === 'deep' ? body.mode : 'deep';
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
