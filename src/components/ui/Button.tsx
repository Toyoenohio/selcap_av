'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md',
  secondary:
    'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300',
  danger:
    'bg-danger text-white hover:bg-red-600 active:bg-red-700 shadow-sm hover:shadow-md',
  ghost:
    'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800',
  outline:
    'bg-transparent text-primary-600 border border-primary-300 hover:bg-primary-50 hover:border-primary-400',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-2.5 text-base rounded-xl gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref,
  ) => {
    const isActuallyLoading = loading || isLoading;
    const isDisabled = disabled || isActuallyLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-medium
          transition-all duration-200 cursor-pointer
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
          disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        aria-busy={isActuallyLoading}
        {...props}
      >
        {isActuallyLoading && (
          <LoadingSpinner
            size="sm"
            className={variant === 'primary' || variant === 'danger' ? 'text-white' : 'text-primary-500'}
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
