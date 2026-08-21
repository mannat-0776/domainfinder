import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getDomainProvider } from '@/providers/domains/factory';
import { toApiError, ValidationError } from '@/lib/errors';
import type { TLD } from '@/types';

const schema = z.object({
  names: z.array(z.string().min(1)).min(1).max(20),
  tlds:  z.array(z.string()).default(['.com', '.io', '.co', '.ai']),
});

// ─── SSE Domain Check ──────────────────────────────────────────────────────────────────
// Results stream to the client as each domain resolves.
// This gives perceived instant feedback even when checking 20+ domains.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Invalid request', parsed.error.flatten());
    }

    const { names, tlds } = parsed.data;
    const provider = await getDomainProvider();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: unknown) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        };

        const checks = names.flatMap((name) =>
          tlds.map((tld) => `${name.toLowerCase()}${tld}`)
        );

        // Check each domain and stream results as they arrive
        await Promise.all(
          checks.map(async (domain) => {
            try {
              const result = await provider.checkAvailability(domain);
              send({ type: 'result', data: result });
            } catch (err) {
              send({
                type: 'error',
                data: { domain, message: toApiError(err).message },
              });
            }
          })
        );

        send({ type: 'done' });
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type':  'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection':    'keep-alive',
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify(toApiError(err)),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
