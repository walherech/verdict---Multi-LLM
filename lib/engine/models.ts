/**
 * Unified LLM provider functions. Each takes (prompt, systemPrompt, context?)
 * and returns the model's response as a string. 30s timeout, errors return
 * an error message string.
 */

const TIMEOUT_MS = 60_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), ms)
    ),
  ]);
}

// --- Perplexity (Sonar Pro) ---
export async function callPerplexity(
  prompt: string,
  systemPrompt: string,
  context?: string
): Promise<string> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) {
    console.error('[Perplexity] Missing PERPLEXITY_API_KEY');
    return '[Perplexity] API key not configured.';
  }

  const userContent = context
    ? `${context}\n\n---\n\nUser request: ${prompt}`
    : prompt;

  try {
    const res = await withTimeout(
      fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          max_tokens: 4096,
        }),
      }),
      TIMEOUT_MS
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Perplexity] API error:', res.status, errText);
      return `[Perplexity] Request failed: ${res.status}. ${errText.slice(0, 200)}`;
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content : '[Perplexity] No content in response.';
  } catch (err) {
    console.error('[Perplexity] Error:', err);
    return `[Perplexity] Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

// --- Claude (Sonnet) ---
export async function callClaude(
  prompt: string,
  systemPrompt: string,
  context?: string
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.error('[Claude] Missing ANTHROPIC_API_KEY');
    return '[Claude] API key not configured.';
  }

  const userContent = context
    ? `${context}\n\n---\n\nUser request: ${prompt}`
    : prompt;

  try {
    const res = await withTimeout(
      fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: userContent }],
        }),
      }),
      TIMEOUT_MS
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Claude] API error:', res.status, errText);
      return `[Claude] Request failed: ${res.status}. ${errText.slice(0, 200)}`;
    }

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const block = data.content?.find((c) => c.type === 'text');
    const text = block?.text;
    return typeof text === 'string' ? text : '[Claude] No text in response.';
  } catch (err) {
    console.error('[Claude] Error:', err);
    return `[Claude] Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

// --- Claude Haiku (for router & evaluator) ---
export async function callClaudeHaiku(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.error('[Claude Haiku] Missing ANTHROPIC_API_KEY');
    return '';
  }

  try {
    const res = await withTimeout(
      fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }],
        }),
      }),
      TIMEOUT_MS
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Claude Haiku] API error:', res.status, errText);
      return '';
    }

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const block = data.content?.find((c) => c.type === 'text');
    const text = block?.text;
    return typeof text === 'string' ? text : '';
  } catch (err) {
    console.error('[Claude Haiku] Error:', err);
    return '';
  }
}

// --- GPT-4 ---
export async function callGpt4(
  prompt: string,
  systemPrompt: string,
  context?: string
): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error('[GPT-4] Missing OPENAI_API_KEY');
    return '[GPT-4] API key not configured.';
  }

  const userContent = context
    ? `${context}\n\n---\n\nUser request: ${prompt}`
    : prompt;

  try {
    const res = await withTimeout(
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          max_tokens: 4096,
        }),
      }),
      TIMEOUT_MS
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[GPT-4] API error:', res.status, errText);
      return `[GPT-4] Request failed: ${res.status}. ${errText.slice(0, 200)}`;
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content : '[GPT-4] No content in response.';
  } catch (err) {
    console.error('[GPT-4] Error:', err);
    return `[GPT-4] Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

// --- Grok ---
export async function callGrok(
  prompt: string,
  systemPrompt: string,
  context?: string
): Promise<string> {
  const key = process.env.XAI_API_KEY;
  if (!key) {
    console.error('[Grok] Missing XAI_API_KEY');
    return '[Grok] API key not configured.';
  }

  const userContent = context
    ? `${context}\n\n---\n\nUser request: ${prompt}`
    : prompt;

  try {
    const res = await withTimeout(
      fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'grok-3',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          max_tokens: 4096,
        }),
      }),
      TIMEOUT_MS
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Grok] API error:', res.status, errText);
      return `[Grok] Request failed: ${res.status}. ${errText.slice(0, 200)}`;
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content : '[Grok] No content in response.';
  } catch (err) {
    console.error('[Grok] Error:', err);
    return `[Grok] Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}
