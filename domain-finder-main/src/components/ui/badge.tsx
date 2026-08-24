import * as React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  brand: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200 border border-brand-200 dark:border-brand-800',
  success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200 border border-success-200 dark:border-success-800',
  warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200 border border-warning-200 dark:border-warning-800',
  danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200 border border-danger-200 dark:border-danger-800',
  neutral: 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200 border border-surface-200 dark:border-surface-700',
} as const;

const sizes = {
  sm: 'px-2 py-1 text-2xs',
  md: 'px-2.5 py-1.5 text-xs',
  lg: 'px-3 py-2 text-sm',
} as const;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'brand', size = 'md', dot = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md font-semibold',
          'transition-colors duration-200',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <div
            className="w-1.5 h-1.5 rounded-full bg-current"
            aria-hidden="true"
          />
        )}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';