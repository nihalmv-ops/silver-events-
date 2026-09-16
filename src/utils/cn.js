import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with Tailwind CSS deduplication
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

