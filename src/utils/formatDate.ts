/**
 * Formats a date as YYYY-MM-DD.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export default function formatDate(date: Date): string {
  const year = date.getFullYear();
  // getMonth() returns 0-based month, so add 1 and pad with zero
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
