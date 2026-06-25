'use client';

import { type InputHTMLAttributes, forwardRef, useId } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<NonNullable<InputProps['inputSize']>, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-3.5 py-2 text-sm rounded-lg',
  lg: 'px-4 py-2.5 text-base rounded-xl',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      inputSize = 'md',
      className = '',
      id: externalId,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const id = externalId ?? autoId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`
              w-full bg-white border transition-all duration-200
              placeholder:text-neutral-400
              focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
              disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
              ${error
                ? 'border-danger text-danger focus:ring-danger/30 focus:border-danger'
                : 'border-neutral-300 text-neutral-800 hover:border-neutral-400'
              }
              ${icon ? 'pl-10' : ''}
              ${sizeClasses[inputSize]}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="text-xs text-danger flex items-center gap-1" role="alert">
            <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
