export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const variantClasses: Record<NonNullable<ProgressBarProps['variant']>, string> = {
  primary: 'bg-primary-500',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const trackSizes: Record<NonNullable<ProgressBarProps['size']>, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = true,
  label,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-neutral-700">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm font-medium text-neutral-500 ml-auto">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-neutral-200 rounded-full overflow-hidden ${trackSizes[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? `Progreso: ${Math.round(percentage)}%`}
      >
        <div
          className={`
            h-full rounded-full transition-all duration-500 ease-out
            ${variantClasses[variant]}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
