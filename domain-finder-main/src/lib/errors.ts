// ─── Application Error Hierarchy ─────────────────────────────────────────────
// Typed errors make catch blocks meaningful and API responses consistent.

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ProviderError extends AppError {
  constructor(provider: string, message: string, details?: unknown) {
    super(`[${provider}] ${message}`, 'PROVIDER_ERROR', 502, details);
    this.name = 'ProviderError';
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfterSeconds?: number) {
    super('Rate limit exceeded', 'RATE_LIMIT', 429, { retryAfterSeconds });
    this.name = 'RateLimitError';
  }
}

/** Convert any error to a safe API response shape */
export function toApiError(err: unknown): { code: string; message: string; details?: unknown } {
  if (err instanceof AppError) {
    return { code: err.code, message: err.message, details: err.details };
  }
  if (err instanceof Error) {
    return { code: 'INTERNAL_ERROR', message: err.message };
  }
  return { code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' };
}

/** Extract HTTP status from any error */
export function toStatusCode(err: unknown): number {
  if (err instanceof AppError) return err.statusCode;
  return 500;
}
