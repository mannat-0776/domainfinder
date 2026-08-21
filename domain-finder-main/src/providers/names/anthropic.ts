import type { INameGenerator, GeneratedName } from '@/types/providers';
import type { NameStyle } from '@/types';
import { ProviderError } from '@/lib/errors';

// ─── Anthropic Name Generator ───────────────────────────────────────────────────────────────
// Activate by setting NAME_GENERATOR_PROVIDER=anthropic in .env
// Requires: ANTHROPIC_API_KEY

export class AnthropicNameGenerator implements INameGenerator {
  readonly name = 'anthropic';

  constructor(private readonly apiKey: string) {}

  async generate(params: {
    idea: string;
    count: number;
    style?: NameStyle;
  }): Promise<GeneratedName[]> {
    const styleInstruction = params.style
      ? `All names must use the "${params.style}" naming style.`
      : 'Use a variety of naming styles.';

    const prompt = `You are a world-class brand naming consultant.

Business idea: ${params.idea}

Generate exactly ${params.count} startup name candidates.
${styleInstruction}

Rules:
- Names must be 4–12 characters
- Names must be pronounceable in English  
- Names must not be existing major brands
- Return ONLY a JSON array, no markdown

Format:
[{"name": "Nexio", "rationale": "...", "style": "invented"}]`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new ProviderError('anthropic', `API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (!content) throw new ProviderError('anthropic', 'Empty response');

    try {
      // Strip any accidental markdown fences
      const clean = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      const names: GeneratedName[] = JSON.parse(clean);
      return names.slice(0, params.count).map((n) => ({
        name:      String(n.name ?? '').trim(),
        rationale: String(n.rationale ?? '').trim(),
        style:     (n.style as NameStyle) ?? 'invented',
      }));
    } catch {
      throw new ProviderError('anthropic', 'Failed to parse JSON response', content);
    }
  }
}
