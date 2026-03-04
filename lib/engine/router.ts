/**
 * Classifies the user prompt and returns the model sequence to run.
 * Uses Claude Haiku for a fast, cheap classification.
 */

import { callClaudeHaiku } from './models';

export type QueryType =
  | 'research'
  | 'strategy'
  | 'creative'
  | 'code'
  | 'writing'
  | 'general';

export interface RouteResult {
  type: string;
  sequence: string[];
  reasoning: string;
}

const SEQUENCE_MAP: Record<QueryType, string[]> = {
  research: ['perplexity', 'claude', 'gpt4'],
  strategy: ['claude', 'gpt4', 'grok'],
  creative: ['grok', 'claude', 'gpt4'],
  code: ['claude', 'gpt4'],
  writing: ['claude', 'gpt4', 'grok'],
  general: ['claude'],
};

const VALID_TYPES: QueryType[] = [
  'research',
  'strategy',
  'creative',
  'code',
  'writing',
  'general',
];

const SYSTEM_PROMPT = `You are a query classifier. Classify the user's query into exactly one of these types: research, strategy, creative, code, writing, general.

- research: needs current info, facts, or web research
- strategy: business strategy, planning, decision-making
- creative: ideas, brainstorming, creative content
- code: programming, technical implementation
- writing: essays, copy, editing, prose
- general: simple Q&A, doesn't fit above

Respond with ONLY a JSON object, no other text. Format:
{"type": "<one of the types above>", "reasoning": "<one short sentence>"}`;

export async function route(prompt: string): Promise<RouteResult> {
  console.log('[Router] Classifying prompt...');
  const raw = await callClaudeHaiku(prompt, SYSTEM_PROMPT);

  let type: QueryType = 'general';
  let reasoning = 'No reasoning provided.';

  if (raw) {
    try {
      const parsed = JSON.parse(raw.trim()) as { type?: string; reasoning?: string };
      if (parsed.type && VALID_TYPES.includes(parsed.type as QueryType)) {
        type = parsed.type as QueryType;
      }
      if (typeof parsed.reasoning === 'string') {
        reasoning = parsed.reasoning;
      }
    } catch {
      // fallback to general
    }
  }

  const sequence = SEQUENCE_MAP[type];
  console.log('[Router] Type:', type, '| Sequence:', sequence, '| Reasoning:', reasoning);
  return { type, sequence, reasoning };
}
