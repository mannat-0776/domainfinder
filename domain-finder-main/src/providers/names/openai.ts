import type { INameGenerator, GeneratedName } from '@/types/providers';
import type { NameStyle } from '@/types';
import { ProviderError } from '@/lib/errors';

// ─── OpenAI Name Generator ────────────────────────────────────────────────────────────────
// Activate by setting NAME_GENERATOR_PROVIDER=openai in .env
// Requires: OPENAI_API_KEY

const SYSTEM_PROMPT = `You are a world-class brand naming consultant.
Your task is to generate startup name candidates based on a business idea.

Rules:
- Names must be 4–12 characters
- Names must be pronounceable in English
- Names must not be existing major brands
- Return ONLY valid JSON — no markdown, no explanation

Output format (array of objects):
[
  {
    "name": "Nexio",
    "rationale": "Why this name fits the idea in 1–2 sentences.",
    "style": "invented"
  }
]

Valid style values: invented, descriptive, metaphor, acronym, founder, compound`;

export class OpenAINameGenerator implements INameGenerator {
  readonly name = 'openai';

  constructor(private readonly apiKey: string) {}

  async generate(params: {
    idea: string;
    count: number;
    style?: NameStyle;
  }): Promise<GeneratedName[]> {
    const styleInstruction = params.style
      ? `All names must use the "${params.style}" naming style.`
      : 'Use a variety of naming styles.';

    const userPrompt = `Business idea: ${params.idea}

Generate exactly ${params.count} startup name candidates.
${styleInstruction}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new ProviderError('openai', `API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new ProviderError('openai', 'Empty response');

    try {
      const parsed = JSON.parse(content);
      // Handle both {names: [...]} and [...] shapes
      const names: GeneratedName[] = Array.isArray(parsed)
        ? parsed
        : parsed.names ?? parsed.candidates ?? [];

      return names.slice(0, params.count).map((n: GeneratedName) => ({
        name:      String(n.name ?? '').trim(),
        rationale: String(n.rationale ?? '').trim(),
        style:     (n.style as NameStyle) ?? 'invented',
      }));
    } catch {
      throw new ProviderError('openai', 'Failed to parse JSON response', content);
    }
  }
}
