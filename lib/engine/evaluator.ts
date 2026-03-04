/**
 * Evaluates the cumulative response against the original prompt.
 * Score is a percentage (0-100). Pass if score >= 80.
 * Returns weaknesses for the next model to address.
 */

import { callClaudeHaiku } from './models';

export interface EvaluationResult {
  /** Percentage score 0-100 */
  score: number;
  pass: boolean;
  weaknesses: string[];
}

const SYSTEM_PROMPT = `You are a quality evaluator. You will receive:
1. The original user prompt
2. The current cumulative response (from one or more AI models)

Score the response on 5 criteria, each from 1 to 10:
- Completeness: Does it fully answer the prompt?
- Accuracy: Are claims supported and reasonable?
- Actionability: Can the user act on this?
- Clarity: Is it well-structured?
- Depth: Does it go beyond surface-level?

Total raw score is the sum of the 5 criteria (out of 50). We will convert to percentage (0-100) elsewhere. Pass = raw score >= 40 (equivalent to 80% or higher).

Also list specific weaknesses (gaps or issues) that the next model in the chain should address. If the response is already strong, list can be empty or minimal.

Respond with ONLY a JSON object, no other text. Format:
{"completeness": <1-10>, "accuracy": <1-10>, "actionability": <1-10>, "clarity": <1-10>, "depth": <1-10>, "weaknesses": ["gap 1", "gap 2", ...]}`;

export async function evaluate(
  prompt: string,
  cumulativeResponse: string,
  modelCount: number
): Promise<EvaluationResult> {
  console.log('[Evaluator] Evaluating response (after', modelCount, 'model(s))...');
  const userContent = `Original prompt:\n${prompt}\n\n---\n\nCurrent cumulative response:\n${cumulativeResponse}`;
  const raw = await callClaudeHaiku(userContent, SYSTEM_PROMPT);

  const defaultResult: EvaluationResult = {
    score: 0,
    pass: false,
    weaknesses: ['Evaluation could not be parsed.'],
  };

  if (!raw) {
    console.log('[Evaluator] No response from Haiku, using default');
    return defaultResult;
  }

  let jsonStr = raw.trim();
  if (jsonStr.startsWith('```')) {
    const end = jsonStr.indexOf('```', 3);
    jsonStr = end > 0 ? jsonStr.slice(3, end).replace(/^json\s*\n?/i, '') : jsonStr.slice(3);
  }

  try {
    const parsed = JSON.parse(jsonStr) as {
      completeness?: number;
      accuracy?: number;
      actionability?: number;
      clarity?: number;
      depth?: number;
      weaknesses?: string[];
    };
    const c = Math.min(10, Math.max(0, Number(parsed.completeness) || 0));
    const a = Math.min(10, Math.max(0, Number(parsed.accuracy) || 0));
    const ac = Math.min(10, Math.max(0, Number(parsed.actionability) || 0));
    const cl = Math.min(10, Math.max(0, Number(parsed.clarity) || 0));
    const d = Math.min(10, Math.max(0, Number(parsed.depth) || 0));
    const rawScore = c + a + ac + cl + d;
    const score = Math.round((rawScore / 50) * 100);
    const pass = score >= 80;
    const weaknesses = Array.isArray(parsed.weaknesses)
      ? parsed.weaknesses.filter((w) => typeof w === 'string')
      : [];

    console.log('[Evaluator] Score:', score, '% | Pass:', pass, '| Weaknesses:', weaknesses.length);
    return { score, pass, weaknesses };
  } catch {
    console.log('[Evaluator] Parse failed, using default');
    return defaultResult;
  }
}
