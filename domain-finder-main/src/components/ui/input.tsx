import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

// Wrapper so we can call useId at the top level (Rules of Hooks)
function InputInner(
  { className, label, error, hint, leftElement, rightElement, id, ...props }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId  = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-surface-700"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftElement && (
          <div className="absolute left-3 text-surface-400 pointer-events-none">
            {leftElement}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={
            [error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined
          }
          aria-invalid={!!error}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2 text-sm',
            'placeholder:text-surface-400 text-surface-900',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
            error
              ? 'border-danger-500 focus:ring-danger-500'
              : 'border-surface-200 hover:border-surface-300',
            leftElement  && 'pl-9',
            rightElement && 'pr-9',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 text-surface-400">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger-500">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-xs text-surface-500">
          {hint}
        </p>
      )}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(InputInner);
Input.displayName = 'Input';
