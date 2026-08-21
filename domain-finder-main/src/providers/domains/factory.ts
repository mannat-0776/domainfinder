import type { IDomainProvider } from '@/types/providers';
import { env } from '@/lib/env';

let _instance: IDomainProvider | null = null;

/**
 * Returns the configured domain provider singleton.
 * Switch providers by changing DOMAIN_PROVIDER env var.
 * No call sites need to change.
 */
export async function getDomainProvider(): Promise<IDomainProvider> {
  if (_instance) return _instance;

  switch (env.DOMAIN_PROVIDER) {
    case 'mock': {
      const { MockDomainProvider } = await import('./mock');
      _instance = new MockDomainProvider();
      break;
    }
    case 'godaddy': {
      // Phase 9: real implementation
      const { GoDaddyProvider } = await import('./godaddy');
      _instance = new GoDaddyProvider(env.GODADDY_API_KEY!, env.GODADDY_API_SECRET!);
      break;
    }
    case 'namecheap': {
      // Phase 9: real implementation
      const { NamecheapProvider } = await import('./namecheap');
      _instance = new NamecheapProvider(env.NAMECHEAP_API_KEY!, env.NAMECHEAP_API_USER!);
      break;
    }
    default:
      throw new Error(`Unknown domain provider: ${env.DOMAIN_PROVIDER}`);
  }

  return _instance;
}
