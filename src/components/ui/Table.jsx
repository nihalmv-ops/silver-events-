import React from 'react'
import { cn } from '../../utils/cn'

export function Table({ className, children, ...props }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white shadow-card">
      <table className={cn('w-full caption-bottom text-sm text-left', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ className, children, ...props }) {
  return (
    <thead className={cn('bg-[#f8fafc] border-b border-[#e2e8f0] text-xs font-semibold text-[#475569] uppercase tracking-wider', className)} {...props}>
      {children}
    </thead>
  )
}

export function TableBody({ className, children, ...props }) {
  return (
    <tbody className={cn('divide-y divide-[#f1f5f9] bg-white text-[#334155]', className)} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({ className, isClickable = false, children, ...props }) {
  return (
    <tr
      className={cn(
        'transition-colors',
        isClickable ? 'hover:bg-[#f8fafc] cursor-pointer' : 'hover:bg-[#fafafa]',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({ className, children, ...props }) {
  return (
    <th
      className={cn('h-11 px-4 text-left align-middle font-medium text-[#475569] text-xs', className)}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ className, children, ...props }) {
  return (
    <td className={cn('p-4 align-middle text-sm text-[#0f172a]', className)} {...props}>
      {children}
    </td>
  )
}

