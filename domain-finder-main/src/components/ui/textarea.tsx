import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
  charLimit?: number;
  showCharCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error = false,
      errorMessage,
      label,
      helperText,
      charLimit,
      showCharCount = false,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const id = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const charCount = String(value || '').length;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          maxLength={charLimit}
          value={value}
          className={cn(
            'w-full px-3 py-2.5 rounded-lg border text-sm resize-none',
            'bg-white dark:bg-surface-800',
            'text-surface-900 dark:text-surface-50',
            'placeholder-surface-500 dark:placeholder-surface-400',
            'transition-colors duration-200',
            'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-10',
            'dark:focus:ring-brand-400 dark:focus:ring-opacity-20',
            error
              ? 'border-danger-500 dark:border-danger-500'
              : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600',
            disabled && 'bg-surface-50 dark:bg-surface-900 cursor-not-allowed opacity-60',
            className
          )}
          {...props}
        />
        <div className="flex items-center justify-between mt-2">
          <div>
            {error && errorMessage && (
              <p className="text-sm text-danger-600 dark:text-danger-400 font-medium">
                {errorMessage}
              </p>
            )}
            {!error && helperText && (
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {helperText}
              </p>
            )}
          </div>
          {showCharCount && charLimit && (
            <p className={cn(
              'text-2xs font-medium',
              charCount >= charLimit * 0.9
                ? 'text-warning-600 dark:text-warning-400'
                : 'text-surface-500 dark:text-surface-400'
            )}>
              {charCount} / {charLimit}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';