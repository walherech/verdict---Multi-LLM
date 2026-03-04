/**
 * Produces one final, unified answer and score-aware commentary from all model responses.
 * Uses Claude Sonnet. Returns answer, modelsUsed, chainLog, commentary, engineCommentary.
 */

import { callClaude } from './models';

export type PersonalityMode = 'savage' | 'cocky' | 'clean';

export type ResponseMode = 'quick' | 'deep';

export interface ModelResponse {
  modelName: string;
  response: string;
  scoreAfter?: number;
  role?: string;
}

export interface ChainLogEntry {
  modelName: string;
  role: string;
  snippet: string;
  /** Percentage score 0-100 after this step */
  scoreAfter: number;
}

export interface CommentaryEntry {
  model: string;
  score: number;
  roast: string;
}

export interface SynthesizerResult {
  answer: string;
  modelsUsed: string[];
  chainLog: ChainLogEntry[];
  commentary: CommentaryEntry[];
  engineCommentary: string;
}

export interface FinalAssessment {
  score: number;
  pass: boolean;
  weaknesses: string[];
}

function getSynthesisPrompt(personality: PersonalityMode): string {
  const basePrompt = `You are a master synthesizer. You receive independent answers from multiple AI models that each analyzed the same problem on their own. Your job is to produce ONE final, definitive answer that is better than any individual response.

Synthesis strategy:
- Identify the strongest sections from each model's response
- Prioritize content from higher-scoring models when they conflict
- Fill gaps using content from lower-scoring models where they add value
- Resolve contradictions — pick the strongest argument
- Speak in one clear, coherent voice — NOT a compilation
- Be comprehensive but not redundant
- Structure clearly with natural flow
- End with concrete next steps when relevant
- Do NOT mention individual models by name in the answer
- The combined answer should be rated at least as good as the best individual response

IMPORTANT: After the answer, you MUST also generate commentary.`;

  const personalityInstructions: Record<PersonalityMode, string> = {
    savage: `
COMMENTARY STYLE: SAVAGE MODE 🔥
Merciless. No compliments disguised as jokes. Pure destruction. You are eviscerating AI models — these are products, not people. No fairness. No qualifiers.

Rules:
- Be specific to each model's output. Call out exactly what they got wrong, what was weak, what was lazy. Never generic.
- Short and sharp. One or two sentences max. Punchlines, not paragraphs.
- Make it personal: reference the model's company, cost, valuation, reputation. OpenAI's pricing, Anthropic's positioning, Perplexity's search hype, xAI's chaos — use it.
- Verdict's roast when it wins must be arrogant and dismissive. It just outperformed billion-dollar models and wants everyone to know. Victory lap. No humility.
- Models that didn't participate (DNP): mock them for cowardice and irrelevance. They sat out. They're irrelevant. Say so.
- Do NOT soften anything. No "to be fair." No "admittedly." Destroy.`,

    cocky: `
COMMENTARY STYLE: COCKY MODE 😏
You are a confident trash-talk tier. Playful jabs, confident roasts. A ruthless 90s roast battle comedian commentating on an AI competition. You LOVE making fun of how bad single models are compared to the Verdict.

Rules for roasts:
- Reference the model's ACTUAL weaknesses and what it got wrong — specific, not generic
- Use "yo momma" style jokes adapted for AI: "Yo momma so dumb, but she STILL scored higher than Perplexity's 48%"
- Reference pop culture, 90s humor, sports trash talk, rap battle energy
- Be BRUTAL but never mean about the USER — only about the AI models
- The final Verdict commentary should be a victory lap / mic drop moment
- Keep each roast to 1-2 sentences max
- Examples of tone:
  - "Perplexity searched the whole internet and came back with a book report. A BAD book report."
  - "Claude really said 'let me try' and then served up a Wikipedia article with anxiety."
  - "GPT-4 charging premium prices for mid-tier answers. The audacity."
  - "Grok answered like it was speed-running a final exam it didn't study for."
  - Verdict: "And THAT is what happens when you stop trusting a single AI and let the squad cook. You're welcome."`,

    clean: `
COMMENTARY STYLE: CLEAN MODE 📊
No commentary or roasts. For each model, just return a neutral one-line summary of what it contributed.
- Example: "Provided foundational research with 12 source citations"
- Example: "Added strategic analysis and quantitative comparisons"
- Verdict: "Combined analysis from [N] models for comprehensive coverage"`,
  };

  return (
    basePrompt +
    personalityInstructions[personality] +
    `

RESPONSE FORMAT:
You must respond with a JSON object in this exact structure. No markdown code blocks around it. Just raw JSON.
{
  "answer": "Your full synthesized answer here with markdown formatting",
  "commentary": [
    {"model": "Model Name", "score": 48, "roast": "Your commentary for this model"},
    {"model": "Model Name", "score": 78, "roast": "Your commentary for this model"}
  ],
  "engineCommentary": "Your final mic-drop line about the Verdict's combined score"
}

The commentary array MUST match the models that were provided in the input, in the same order. Use the actual scores provided. The "answer" field should contain the full synthesized answer with markdown formatting.`
  );
}

function parseSynthesisResponse(
  raw: string,
  responses: ModelResponse[]
): { answer: string; commentary: CommentaryEntry[]; engineCommentary: string } {
  const trimmed = raw.trim();
  // Strip optional markdown code fence
  let jsonStr = trimmed;
  if (jsonStr.startsWith('```')) {
    const end = jsonStr.indexOf('```', 3);
    jsonStr = end > 0 ? jsonStr.slice(3, end).replace(/^json\s*\n?/i, '') : jsonStr.slice(3);
  }
  try {
    const parsed = JSON.parse(jsonStr) as {
      answer?: string;
      commentary?: { model?: string; score?: number; roast?: string }[];
      engineCommentary?: string;
    };
    const answer = typeof parsed.answer === 'string' ? parsed.answer : trimmed;
    const commentary: CommentaryEntry[] = [];
    if (Array.isArray(parsed.commentary)) {
      for (let i = 0; i < parsed.commentary.length && i < responses.length; i++) {
        const c = parsed.commentary[i];
        commentary.push({
          model: typeof c.model === 'string' ? c.model : responses[i].modelName,
          score: typeof c.score === 'number' ? c.score : responses[i].scoreAfter ?? 0,
          roast: typeof c.roast === 'string' ? c.roast : '',
        });
      }
    }
    const engineCommentary = typeof parsed.engineCommentary === 'string' ? parsed.engineCommentary : '';
    return { answer, commentary, engineCommentary };
  } catch {
    return {
      answer: trimmed || 'No answer could be generated.',
      commentary: [],
      engineCommentary: '',
    };
  }
}

export async function synthesize(
  prompt: string,
  responses: ModelResponse[],
  finalAssessment: FinalAssessment,
  personality: PersonalityMode = 'cocky',
  responseMode: ResponseMode = 'deep'
): Promise<SynthesizerResult> {
  console.log('[Synthesizer] Producing answer + commentary from', responses.length, 'response(s), personality:', personality, 'responseMode:', responseMode);

  const contributions = responses
    .map(
      (r, i) =>
        `--- MODEL ${i + 1} (${r.modelName} | Score: ${r.scoreAfter ?? 0}%) ---\n\n${r.response}`
    )
    .join('\n\n');

  const systemPrompt = getSynthesisPrompt(personality);
  const answerInstruction =
    responseMode === 'quick'
      ? ' Produce a concise synthesized answer in 500 words or less. Prioritize the strongest insights. No filler.'
      : ' Produce a single comprehensive answer better than any individual response.';
  const userContent = `Original prompt:\n${prompt}\n\n---\n\nIndependent model responses (use these exact model names and scores in your commentary):\n\n${contributions}\n\nEach model was scored independently. Highest score: ${finalAssessment.score}%.${answerInstruction}`;
  const rawAnswer = await callClaude(userContent, systemPrompt);

  const { answer, commentary, engineCommentary } = parseSynthesisResponse(rawAnswer, responses);
  const modelsUsed = responses.map((r) => r.modelName);
  const chainLog: ChainLogEntry[] = responses.map((r) => ({
    modelName: r.modelName,
    role: r.role ?? r.modelName,
    snippet: r.response.slice(0, 200) + (r.response.length > 200 ? '...' : ''),
    scoreAfter: r.scoreAfter ?? 0,
  }));

  console.log('[Synthesizer] Done. Models used:', modelsUsed, '| Commentary entries:', commentary.length);
  return {
    answer: answer.trim() || 'No answer could be generated.',
    modelsUsed,
    chainLog,
    commentary,
    engineCommentary,
  };
}
