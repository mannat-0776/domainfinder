import * as React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default:   'bg-surface-100 text-surface-700 border border-surface-200',
  brand:     'bg-brand-50 text-brand-700 border border-brand-200',
  success:   'bg-success-50 text-success-700 border border-success-500/30',
  warning:   'bg-warning-50 text-warning-700 border border-warning-500/30',
  danger:    'bg-danger-50 text-danger-700 border border-danger-500/30',
  premium:   'bg-amber-50 text-amber-700 border border-amber-300',
} as const;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5',
        'text-xs font-medium leading-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-success-500',
            variant === 'warning' && 'bg-warning-500',
            variant === 'danger'  && 'bg-danger-500',
            variant === 'brand'   && 'bg-brand-500',
            variant === 'premium' && 'bg-amber-500',
            variant === 'default' && 'bg-surface-400',
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
