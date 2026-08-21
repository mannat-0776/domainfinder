import type { INameGenerator } from '@/types/providers';
import { env } from '@/lib/env';

let _instance: INameGenerator | null = null;

/**
 * Returns the configured name generator singleton.
 * Switch providers by changing NAME_GENERATOR_PROVIDER env var.
 * No call sites need to change.
 */
export async function getNameGenerator(): Promise<INameGenerator> {
  if (_instance) return _instance;

  switch (env.NAME_GENERATOR_PROVIDER) {
    case 'mock': {
      const { MockNameGenerator } = await import('./mock');
      _instance = new MockNameGenerator();
      break;
    }
    case 'openai': {
      // Phase 9: real implementation
      const { OpenAINameGenerator } = await import('./openai');
      _instance = new OpenAINameGenerator(env.OPENAI_API_KEY!);
      break;
    }
    case 'anthropic': {
      // Phase 9: real implementation
      const { AnthropicNameGenerator } = await import('./anthropic');
      _instance = new AnthropicNameGenerator(env.ANTHROPIC_API_KEY!);
      break;
    }
    default:
      throw new Error(`Unknown name generator provider: ${env.NAME_GENERATOR_PROVIDER}`);
  }

  return _instance;
}
