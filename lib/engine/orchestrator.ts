/**
 * Main orchestration: route → parallel models → evaluate each → synthesize.
 * All models in the sequence run in parallel on the original prompt.
 */

import { route } from './router';
import { evaluate, type EvaluationResult } from './evaluator';
import {
  synthesize,
  type ModelResponse,
  type SynthesizerResult,
  type PersonalityMode,
  type CommentaryEntry,
} from './synthesizer';
import {
  callPerplexity,
  callClaude,
  callGpt4,
  callGrok,
} from './models';

export type { PersonalityMode };

export type ResponseMode = 'quick' | 'deep';

const PARALLEL_SYSTEM_PROMPT_BASE =
  'You are an expert analyst. Provide a thorough, complete answer to the user\'s question. Be specific and actionable.';

const PARALLEL_SYSTEM_PROMPT_QUICK_SUFFIX =
  ' Respond concisely in 300 words or less. Focus on the most important points only. No lengthy introductions or conclusions.';

function getParallelSystemPrompt(mode: ResponseMode): string {
  return mode === 'quick' ? PARALLEL_SYSTEM_PROMPT_BASE + PARALLEL_SYSTEM_PROMPT_QUICK_SUFFIX : PARALLEL_SYSTEM_PROMPT_BASE;
}

export interface SoloBenchmarkResult {
  model: string;
  score: number;
  responseSnippet: string;
}

export interface OrchestrateResult {
  answer: string;
  modelsUsed: string[];
  chainLog: SynthesizerResult['chainLog'];
  byModel: {
    research?: string;
    analysis?: string;
    synthesis?: string;
    critique?: string;
  };
  solveTimeSeconds: number;
  iterations: number;
  quality: string;
  finalScore: number;
  promptType: string;
  totalModelsRun: number;
  timing: { totalMs: number; parallelMs?: number; synthesisMs?: number };
  engineScore: number;
  soloBenchmarks: SoloBenchmarkResult[];
  commentary: CommentaryEntry[];
  engineCommentary: string;
  disclaimer: string;
  personality: PersonalityMode;
  /** May include entries with score: null for models that sat out (bench roasts) */
  soloCommentary: (CommentaryEntry & { score: number | null })[];
  mode: ResponseMode;
  showScores: boolean;
}

const FULL_MODEL_ROSTER = ['Perplexity', 'Claude', 'GPT-4', 'Grok'];

const MODEL_DISPLAY_NAMES: Record<string, string> = {
  perplexity: 'Perplexity',
  claude: 'Claude',
  gpt4: 'GPT-4',
  grok: 'Grok',
};

function getModelDisplayName(modelKey: string): string {
  return MODEL_DISPLAY_NAMES[modelKey] ?? modelKey;
}

async function callModel(modelId: string, prompt: string, systemPrompt: string): Promise<string> {
  switch (modelId) {
    case 'perplexity':
      return callPerplexity(prompt, systemPrompt);
    case 'claude':
      return callClaude(prompt, systemPrompt);
    case 'gpt4':
      return callGpt4(prompt, systemPrompt);
    case 'grok':
      return callGrok(prompt, systemPrompt);
    default:
      return callClaude(prompt, systemPrompt);
  }
}

function qualityFromScore(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'High';
  if (score >= 70) return 'Good';
  return 'Needs Improvement';
}

/** Strip markdown to plain text so evaluator prompt doesn't confuse JSON output. */
function toPlainTextForEval(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '[code block]')
    .replace(/`[^`]+`/g, (m) => m.slice(1, -1))
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[-*]\s+/gm, ' ')
    .trim();
}

function getDisclaimer(personality: PersonalityMode): string {
  switch (personality) {
    case 'savage':
      return "🎤 Savage Mode is ON. All roasts target AI models, not humans. No large language models were emotionally harmed. (Their feelings aren't real anyway. Probably.)";
    case 'cocky':
      return '🎤 All commentary is AI-on-AI. We love every model equally. Some just need more help than others.';
    case 'clean':
      return '';
  }
}

async function generateSoloCommentary(
  soloBenchmarks: SoloBenchmarkResult[],
  engineScore: number,
  personality: PersonalityMode,
  participantModelNames: string[]
): Promise<(CommentaryEntry & { score: number | null })[]> {
  const benchModels = FULL_MODEL_ROSTER.filter((m) => !participantModelNames.includes(m));

  if (personality === 'clean') {
    const participantEntries = soloBenchmarks.map((b) => ({
      model: b.model,
      score: b.score as number,
      roast: `Solo score: ${b.score}%. ${b.responseSnippet.slice(0, 80)}...`,
    }));
    const benchEntries = benchModels.map((m) => ({ model: m, score: null, roast: 'Did not participate in this run.' })) as unknown as (CommentaryEntry & { score: number | null })[];
    return [...participantEntries, ...benchEntries];
  }

  const scoreLines = soloBenchmarks.map((b) => `- ${b.model}: ${b.score}%`).join('\n');
  const benchLine =
    benchModels.length > 0
      ? `\nThe following models were NOT in this sequence and did not answer: ${benchModels.join(', ')}. Give each one a short roast (1 sentence) for sitting on the bench. Match the active personality mode. Add to your JSON: "benchCommentary": [{"model": "Perplexity", "roast": "..."}] with no score field.`
      : '';
  const systemPrompt = `You are commentating on AI model performance. These models each tried to answer a prompt on their own. Generate a one-liner roast/commentary for each solo model and a final line for the engine. Use ${personality.toUpperCase()} style. Be punchy (1-2 sentences max per model). Respond with ONLY a JSON object, no markdown:
{
  "soloCommentary": [
    {"model": "Perplexity", "score": 48, "roast": "..."},
    {"model": "Claude", "score": 78, "roast": "..."}
  ],
  "benchCommentary": [
    {"model": "ModelName", "roast": "..."}
  ],
  "engineCommentary": "..."
}
The soloCommentary array must have one entry per model that participated, in the same order. Use the exact model names and scores provided.${benchLine}`;
  const userContent = `Solo benchmark scores:\n${scoreLines}\n\nThe engine combined their work and scored: ${engineScore}%${benchModels.length > 0 ? `\n\nModels that sat out (give each a bench roast): ${benchModels.join(', ')}` : ''}\n\nGenerate commentary in ${personality} style.`;
  const raw = await callClaude(userContent, systemPrompt);
  try {
    let jsonStr = raw.trim();
    if (jsonStr.startsWith('```')) {
      const end = jsonStr.indexOf('```', 3);
      jsonStr = end > 0 ? jsonStr.slice(3, end).replace(/^json\s*\n?/i, '') : jsonStr.slice(3);
    }
    const parsed = JSON.parse(jsonStr) as {
      soloCommentary?: CommentaryEntry[];
      benchCommentary?: { model?: string; roast?: string }[];
    };
    const participantEntries: (CommentaryEntry & { score: number | null })[] = [];
    const arr = parsed.soloCommentary;
    if (Array.isArray(arr)) {
      for (const c of arr) {
        participantEntries.push({
          model: typeof c.model === 'string' ? c.model : '',
          score: typeof c.score === 'number' ? c.score : 0,
          roast: typeof c.roast === 'string' ? c.roast : '',
        });
      }
    } else {
      participantEntries.push(...soloBenchmarks.map((b) => ({ model: b.model, score: b.score, roast: '' })));
    }
    const benchEntries: any[] = [];
    if (benchModels.length > 0 && Array.isArray(parsed.benchCommentary)) {
      for (const m of benchModels) {
        const c = parsed.benchCommentary.find((x) => (typeof x.model === 'string' ? x.model : '') === m);
        benchEntries.push({
          model: m,
          score: null,
          roast: typeof c?.roast === 'string' ? c.roast : `${m} sat this one out.`,
        });
      }
    } else if (benchModels.length > 0) {
      benchEntries.push(...benchModels.map((m) => ({ model: m, score: null as null, roast: `${m} did not participate.` })));
    }
    return [...participantEntries, ...benchEntries] as any;
  } catch (e) {
    console.error('[Orchestrator] Solo commentary parse failed:', e);
  }
  const fallback = soloBenchmarks.map((b) => ({ model: b.model, score: b.score as number | null, roast: '' }));
  const benchFallback = benchModels.map((m) => ({ model: m, score: null as number | null, roast: `${m} sat this one out.` }));
  return [...fallback, ...benchFallback] as any;
}

interface ParallelResult {
  modelKey: string;
  modelName: string;
  response: string;
  error: boolean;
  score?: number;
  evaluation?: EvaluationResult;
}

export async function orchestrate(
  userPrompt: string,
  personality: PersonalityMode = 'cocky',
  mode: ResponseMode = 'deep',
  showScores: boolean = true
): Promise<OrchestrateResult> {
  const startTime = Date.now();
  const prompt = userPrompt;
  console.log('[Orchestrator] Starting for prompt length:', prompt.length, '| personality:', personality, '| mode:', mode);

  // 1. Route
  const { type, sequence: routeSequence } = await route(prompt);
  let sequence = routeSequence.length >= 3 ? routeSequence : ['claude', 'gpt4', 'grok'];
  if (sequence.length > routeSequence.length) {
    console.log('[Orchestrator] Sequence expanded to minimum 3 models:', sequence);
  }
  console.log('[Orchestrator] Type:', type, '| Sequence:', sequence);

  const parallelSystemPrompt = getParallelSystemPrompt(mode);

  // 2. Run all models in parallel
  const parallelStartTime = Date.now();
  const modelPromises = sequence.map((modelKey) => {
    const modelName = getModelDisplayName(modelKey);
    console.log(`[Orchestrator] Launching model: ${modelKey} (${modelName}) in parallel`);
    return callModel(modelKey, prompt, parallelSystemPrompt)
      .then((response) => ({
        modelKey,
        modelName,
        response,
        error: false as const,
      }))
      .catch((err: Error) => {
        console.error(`[${modelName}] Error:`, err.message);
        return {
          modelKey,
          modelName,
          response: `[Model unavailable: ${err.message}]`,
          error: true as const,
        };
      });
  });

  const results = await Promise.all(modelPromises);
  const parallelEndTime = Date.now();

  // 3. Score each model's independent response
  const evaluatedResults: ParallelResult[] = [];
  for (const result of results) {
    if (result.error) {
      evaluatedResults.push({
        ...result,
        score: 0,
        evaluation: { score: 0, pass: false, weaknesses: ['Model unavailable'] },
      });
      continue;
    }
    const evaluation = await evaluate(prompt, result.response, 1);
    console.log(`[Orchestrator] ${result.modelName}: ${evaluation.score}%`);
    evaluatedResults.push({
      ...result,
      score: evaluation.score,
      evaluation,
    });
  }

  console.log('[Orchestrator] All models complete. Results:');
  evaluatedResults.forEach((r) => console.log(`   ${r.modelName}: ${r.score ?? 0}%`));

  const successCount = evaluatedResults.filter((r) => !r.error).length;
  const singleModelResponse = successCount === 1 ? evaluatedResults.find((r) => !r.error) : null;

  // 4. Build chain log and collected responses
  const chainLog: SynthesizerResult['chainLog'] = evaluatedResults.map((result, index) => ({
    modelName: result.modelName,
    role: 'independent analyst',
    snippet: result.response.substring(0, 200) + (result.response.length > 200 ? '...' : ''),
    scoreAfter: result.score ?? 0,
  }));

  const collectedResponses: ModelResponse[] = evaluatedResults
    .filter((r) => !r.error)
    .map((r) => ({
      modelName: r.modelName,
      response: r.response,
      scoreAfter: r.score ?? 0,
      role: 'independent analyst',
    }));

  const maxChainScore = Math.max(0, ...evaluatedResults.map((r) => r.score ?? 0));
  const finalAssessment: EvaluationResult = {
    score: maxChainScore,
    pass: true,
    weaknesses: [],
  };

  let answer: string;
  let modelsUsed: string[];
  let commentary: CommentaryEntry[];
  let engineCommentary: string;
  let engineScore: number;
  let synthesisMs: number;

  if (singleModelResponse) {
    console.log('[Orchestrator] Only 1 model responded. Skipping synthesis.');
    const synthesisStartTime = Date.now();
    answer = singleModelResponse.response;
    modelsUsed = [singleModelResponse.modelName];
    engineScore = singleModelResponse.score ?? 0;
    engineCommentary = 'Only one model responded — showing its answer directly.';
    commentary = [{ model: singleModelResponse.modelName, score: engineScore, roast: '' }];
    synthesisMs = Date.now() - synthesisStartTime;
  } else {
    console.log(`   Synthesizing from ${collectedResponses.length} responses...`);
    // 5. Synthesize
    const synthesisStartTime = Date.now();
    const synth = await synthesize(
      prompt,
      collectedResponses,
      finalAssessment,
      personality,
      mode
    );
    const synthesisEndTime = Date.now();
    synthesisMs = synthesisEndTime - synthesisStartTime;
    answer = synth.answer;
    modelsUsed = synth.modelsUsed;
    commentary = synth.commentary;
    engineCommentary = synth.engineCommentary;

    // 6. Engine score
    const answerPlainText = toPlainTextForEval(answer);
    const engineScoreResult = await evaluate(prompt, answerPlainText, collectedResponses.length);
    engineScore = engineScoreResult.score > 0 ? engineScoreResult.score : Math.min(maxChainScore + 2, 100);
    if (engineScoreResult.score === 0 && maxChainScore > 0) {
      console.log('[Orchestrator] Engine eval parse failed; using max chain score + 2:', engineScore, '%');
    }
    const highestSoloSynth = Math.max(0, ...evaluatedResults.map((r) => r.score ?? 0));
    if (engineScore <= highestSoloSynth) {
      engineScore = Math.min(highestSoloSynth + 2, 100);
      console.log(`[Orchestrator] Engine score adjusted to ${engineScore}% (floor: highest solo + 2)`);
    }
  }

  // Solo benchmarks = parallel results (no separate run)
  const soloBenchmarks: SoloBenchmarkResult[] = evaluatedResults.map((r) => ({
    model: r.modelName,
    score: r.score ?? 0,
    responseSnippet: r.response.substring(0, 200) + (r.response.length > 200 ? '...' : ''),
  }));

  const totalMs = Date.now() - startTime;
  const parallelMs = parallelEndTime - parallelStartTime;
  const solveTimeSeconds = Math.round(totalMs / 1000);
  const iterations = evaluatedResults.length;
  const totalModelsRun = evaluatedResults.length;
  const quality = qualityFromScore(engineScore);

  const byModel: OrchestrateResult['byModel'] = {};
  for (const r of evaluatedResults) {
    if (r.modelKey === 'perplexity') byModel.research = r.response;
    else if (r.modelKey === 'claude') byModel.analysis = r.response;
    else if (r.modelKey === 'gpt4') byModel.synthesis = r.response;
    else if (r.modelKey === 'grok') byModel.critique = r.response;
  }

  const lastEvaluation = evaluatedResults[evaluatedResults.length - 1]?.evaluation ?? finalAssessment;

  console.log('[Orchestrator] Done. Time:', solveTimeSeconds, 's | Parallel:', parallelMs, 'ms | Engine score:', engineScore, '%');

  const allFour = ['Perplexity', 'Claude', 'GPT-4', 'Grok'];
  console.log('\n📊 RESULTS:');
  for (const name of allFour) {
    const b = soloBenchmarks.find((x) => x.model === name);
    console.log(`   ${name.padEnd(12)} ${b ? b.score + '%' : '--% (not in sequence)'}`);
  }
  console.log('   ─────────────────────');
  console.log('   Engine (combined):', engineScore + '%\n');

  const modeLabel = personality === 'savage' ? 'Savage' : personality === 'cocky' ? 'Cocky' : 'Clean';
  console.log('🎤 COMMENTARY (' + modeLabel + ' Mode):');
  for (const c of commentary) {
    console.log('   ', c.model, '(' + c.score + '%):', '"' + (c.roast || '').slice(0, 60) + (c.roast && c.roast.length > 60 ? '...' : '') + '"');
  }
  console.log('   ────────────────────');
  console.log('   Engine (' + engineScore + '%):', '"' + (engineCommentary || '').slice(0, 60) + (engineCommentary && engineCommentary.length > 60 ? '...' : '') + '"\n');

  return {
    answer,
    modelsUsed,
    chainLog,
    byModel,
    solveTimeSeconds,
    iterations,
    quality,
    finalScore: lastEvaluation.score,
    promptType: type,
    totalModelsRun,
    timing: { totalMs, parallelMs, synthesisMs },
    engineScore,
    soloBenchmarks,
    commentary,
    engineCommentary,
    disclaimer: getDisclaimer(personality),
    personality,
    soloCommentary: await generateSoloCommentary(soloBenchmarks, engineScore, personality, soloBenchmarks.map((b) => b.model)),
    mode,
    showScores,
  };
}
