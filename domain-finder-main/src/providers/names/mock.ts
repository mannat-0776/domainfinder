import type { INameGenerator, GeneratedName } from '@/types/providers';
import type { NameStyle } from '@/types';
import { sleep } from '@/lib/utils';

// ─── Mock Name Generator ────────────────────────────────────────────────────────────────
// Realistic mock data keyed by idea keywords.
// Replace with OpenAI/Anthropic provider by setting NAME_GENERATOR_PROVIDER=openai.

const MOCK_NAMES: GeneratedName[] = [
  {
    name: 'Launchly',
    rationale: 'Combines "launch" with the "-ly" suffix popular in SaaS, signalling speed and action.',
    style: 'invented',
  },
  {
    name: 'Foundry',
    rationale: 'A foundry shapes raw material into finished products — a powerful metaphor for building startups.',
    style: 'metaphor',
  },
  {
    name: 'Vantage',
    rationale: 'Suggests a superior vantage point — seeing further and acting smarter than competitors.',
    style: 'metaphor',
  },
  {
    name: 'Nexio',
    rationale: 'Derived from "nexus" (connection hub) with a modern "-io" ending that reads as tech-native.',
    style: 'invented',
  },
  {
    name: 'Clearpath',
    rationale: 'Two common words that together promise clarity and direction — instantly understood.',
    style: 'compound',
  },
  {
    name: 'Orbis',
    rationale: 'Latin for "world" or "circle" — global ambition in five letters, easy to spell and say.',
    style: 'metaphor',
  },
  {
    name: 'Stackwise',
    rationale: 'Speaks directly to technical founders: smart decisions about your technology stack.',
    style: 'compound',
  },
  {
    name: 'Lumio',
    rationale: 'From "lumen" (light) — illuminating, warm, and memorable with a soft phonetic profile.',
    style: 'invented',
  },
  {
    name: 'Patchwork',
    rationale: 'Evokes craftsmanship and community — many pieces assembled into something beautiful.',
    style: 'metaphor',
  },
  {
    name: 'Driftly',
    rationale: 'Fluid and effortless movement — ideal for logistics, travel, or workflow automation.',
    style: 'invented',
  },
];

export class MockNameGenerator implements INameGenerator {
  readonly name = 'mock';

  async generate(params: {
    idea: string;
    count: number;
    style?: NameStyle;
  }): Promise<GeneratedName[]> {
    // Simulate network latency
    await sleep(600 + Math.random() * 400);

    const pool = params.style
      ? MOCK_NAMES.filter((n) => n.style === params.style)
      : MOCK_NAMES;

    // Shuffle deterministically based on idea text so same idea = same names
    const seed = params.idea.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const shuffled = [...pool].sort(() => Math.sin(seed) - 0.5);

    return shuffled.slice(0, Math.min(params.count, shuffled.length));
  }
}
