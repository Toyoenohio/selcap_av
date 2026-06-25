export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const sizeClasses: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
  xl: 'h-12 w-12 border-[3px]',
};

export function LoadingSpinner({
  size = 'md',
  className = '',
  label = 'Cargando...',
}: LoadingSpinnerProps) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`} role="status" aria-label={label}>
      <div
        className={`
          animate-spin rounded-full
          border-current border-t-transparent
          ${sizeClasses[size]}
        `}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
