import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      error = false,
      errorMessage,
      label,
      helperText,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

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
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={id}
            disabled={disabled}
            className={cn(
              'w-full h-10 rounded-lg border text-sm',
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
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400 font-medium">
            {errorMessage}
          </p>
        )}
        {!error && helperText && (
          <p className="mt-1.5 text-sm text-surface-500 dark:text-surface-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';