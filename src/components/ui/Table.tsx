import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes, HTMLAttributes } from 'react';

/* ─── Table Root ──────────────────────────────── */

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  striped?: boolean;
}

export function Table({ children, striped = true, className = '', ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-200">
      <table
        className={`w-full text-sm text-left ${striped ? '[&_tbody_tr:nth-child(even)]:bg-neutral-50' : ''} ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

/* ─── Table Header ────────────────────────────── */

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export function TableHeader({ children, className = '', ...props }: TableHeaderProps) {
  return (
    <thead className={`bg-neutral-50 border-b border-neutral-200 ${className}`} {...props}>
      {children}
    </thead>
  );
}

/* ─── Table Body ──────────────────────────────── */

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export function TableBody({ children, className = '', ...props }: TableBodyProps) {
  return (
    <tbody className={`divide-y divide-neutral-100 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

/* ─── Table Row ───────────────────────────────── */

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  clickable?: boolean;
}

export function TableRow({ children, clickable = false, className = '', ...props }: TableRowProps) {
  return (
    <tr
      className={`
        transition-colors duration-150
        ${clickable ? 'hover:bg-primary-50 cursor-pointer' : 'hover:bg-neutral-50'}
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  );
}

/* ─── Table Head Cell ─────────────────────────── */

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export function TableHead({
  children,
  sortable = false,
  sortDirection = null,
  onSort,
  className = '',
  ...props
}: TableHeadProps) {
  return (
    <th
      className={`
        px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider
        ${sortable ? 'cursor-pointer select-none hover:text-neutral-700 transition-colors duration-150' : ''}
        ${className}
      `}
      onClick={sortable ? onSort : undefined}
      aria-sort={
        sortDirection === 'asc'
          ? 'ascending'
          : sortDirection === 'desc'
          ? 'descending'
          : undefined
      }
      {...props}
    >
      <div className="flex items-center gap-1.5">
        {children}
        {sortable && (
          <span className="inline-flex flex-col" aria-hidden="true">
            <svg
              className={`h-3 w-3 -mb-0.5 ${sortDirection === 'asc' ? 'text-primary-500' : 'text-neutral-300'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6l-5 5h10l-5-5z" />
            </svg>
            <svg
              className={`h-3 w-3 -mt-0.5 ${sortDirection === 'desc' ? 'text-primary-500' : 'text-neutral-300'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 14l5-5H5l5 5z" />
            </svg>
          </span>
        )}
      </div>
    </th>
  );
}

/* ─── Table Cell ──────────────────────────────── */

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export function TableCell({ children, className = '', ...props }: TableCellProps) {
  return (
    <td className={`px-4 py-3 text-neutral-700 ${className}`} {...props}>
      {children}
    </td>
  );
}
