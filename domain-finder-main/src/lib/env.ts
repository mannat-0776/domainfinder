import { z } from 'zod';

// Validated at startup — fail fast with a clear message.
// In test/CI environments, all provider keys are optional (mock mode).
const envSchema = z.object({
  NAME_GENERATOR_PROVIDER: z.enum(['mock', 'openai', 'anthropic']).default('mock'),
  DOMAIN_PROVIDER:         z.enum(['mock', 'godaddy', 'namecheap']).default('mock'),

  OPENAI_API_KEY:    z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),

  GODADDY_API_KEY:    z.string().optional(),
  GODADDY_API_SECRET: z.string().optional(),
  NAMECHEAP_API_KEY:  z.string().optional(),
  NAMECHEAP_API_USER: z.string().optional(),

  DATABASE_URL: z.string().optional(),
  DIRECT_URL:   z.string().optional(),
  REDIS_URL:    z.string().optional(),
  REDIS_TOKEN:  z.string().optional(),

  NEXT_PUBLIC_SUPABASE_URL:      z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY:     z.string().optional(),

  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    // In test environments, log but don't throw
    if (process.env.NODE_ENV === 'test') {
      return envSchema.parse({
        NAME_GENERATOR_PROVIDER: 'mock',
        DOMAIN_PROVIDER: 'mock',
        NODE_ENV: 'test',
      });
    }
    console.error('❌ Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables — see above for details.');
  }
  return result.data;
}

export const env = parseEnv();
