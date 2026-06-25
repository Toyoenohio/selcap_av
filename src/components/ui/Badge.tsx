import type { ReactNode } from 'react';

export interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  success: 'bg-success-light text-emerald-700',
  danger: 'bg-danger-light text-red-700',
  warning: 'bg-warning-light text-amber-700',
  info: 'bg-info-light text-blue-700',
  neutral: 'bg-neutral-100 text-neutral-600',
  primary: 'bg-primary-50 text-primary-700',
};

const dotColors: Record<NonNullable<BadgeProps['variant']>, string> = {
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-info',
  neutral: 'bg-neutral-400',
  primary: 'bg-primary-500',
};

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({
  variant = 'neutral',
  size = 'sm',
  children,
  className = '',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        transition-colors duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
