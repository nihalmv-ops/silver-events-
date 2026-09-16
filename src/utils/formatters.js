/**
 * Format an integer number with commas (Indian number formatting)
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('en-IN').format(num)
}

/**
 * Format currency in Indian Rupees (₹)
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a date object or ISO string to standard human readable format
 */
export function formatDate(dateStr, options = {}) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date)
}

