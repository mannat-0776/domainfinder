import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  charCount?: boolean;
  maxLength?: number;
}

function TextareaInner(
  { className, label, error, hint, charCount, maxLength, id, value, ...props }: TextareaProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-surface-700"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        value={value}
        maxLength={maxLength}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2.5 text-sm',
          'placeholder:text-surface-400 text-surface-900 resize-none',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
          error
            ? 'border-danger-500 focus:ring-danger-500'
            : 'border-surface-200 hover:border-surface-300',
          className
        )}
        {...props}
      />
      <div className="flex justify-between items-center">
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-danger-500">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-surface-500">{hint}</p>
        ) : (
          <span />
        )}
        {charCount && maxLength && (
          <span
            className={cn(
              'text-xs tabular-nums',
              currentLength > maxLength * 0.9
                ? 'text-warning-500'
                : 'text-surface-400'
            )}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(TextareaInner);
Textarea.displayName = 'Textarea';
