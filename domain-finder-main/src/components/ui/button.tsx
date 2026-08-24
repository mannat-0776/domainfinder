import * as React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 dark:active:bg-brand-700 shadow-sm hover:shadow-base',
  secondary:
    'bg-surface-100 text-surface-900 hover:bg-surface-200 active:bg-surface-200 dark:bg-surface-800 dark:text-surface-50 dark:hover:bg-surface-700 dark:active:bg-surface-600 border border-surface-200 dark:border-surface-700',
  outline:
    'border border-brand-500 text-brand-600 hover:bg-brand-50 active:bg-brand-100 dark:text-brand-400 dark:hover:bg-brand-950 dark:active:bg-brand-900 dark:border-brand-400',
  ghost:
    'text-surface-700 hover:bg-surface-100 active:bg-surface-200 dark:text-surface-300 dark:hover:bg-surface-800 dark:active:bg-surface-700 transition-colors',
  danger:
    'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 dark:bg-danger-600 dark:hover:bg-danger-500 dark:active:bg-danger-700 shadow-sm hover:shadow-base',
  success:
    'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 dark:bg-success-600 dark:hover:bg-success-500 dark:active:bg-success-700 shadow-sm hover:shadow-base',
} as const;

const sizes = {
  xs: 'h-8 px-2.5 text-xs gap-1',
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2.5',
  icon: 'h-10 w-10 text-base',
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium',
          'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-900',
          'hover:scale-105 active:scale-95',
          'disabled:pointer-events-none disabled:opacity-50 disabled:scale-100',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';