import type { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: ReactNode;
  footer?: ReactNode;
}

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  hover = false,
  padding = 'md',
  header,
  footer,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-neutral-200 shadow-sm
        transition-all duration-200
        ${hover ? 'hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5' : ''}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-neutral-200">
          {header}
        </div>
      )}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-neutral-200">
          {footer}
        </div>
      )}
    </div>
  );
}
