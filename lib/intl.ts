const dateTime = Intl.DateTimeFormat('en-US', { dateStyle: 'long' })

/**
 * Format a date.
 *
 * @param date
 *   The date to format.
 * @returns
 *   The formatted date.
 */
export function formatDate(date: Date | string): string {
  return dateTime.format(new Date(date))
}
