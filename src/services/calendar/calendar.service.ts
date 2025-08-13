import AppError from '@utils/errors';
import { getCalendarAliasMap } from './calendarCache.service';

let cachedSummaries: string[] | null = null;

/**
 * Retrieves a list of calendar summaries.
 * This function fetches the calendar alias map and returns the aliases as summaries.
 * @returns A promise that resolves to an array of calendar summaries.
 * @module calendar.service
 */
export const getCalendarSummaries = async (): Promise<string[]> => {
  if (cachedSummaries) {
    return cachedSummaries;
  }

  const aliasMap = await getCalendarAliasMap();
  const summaries = Object.entries(aliasMap).map(([alias]) => alias);

  if (summaries.length === 0) {
    throw AppError.notFound('No calendars found');
  }

  cachedSummaries = summaries;
  return summaries;
};

/**
 * Invalidates the cached calendar summaries.
 * This function sets the cached summaries to null, forcing a refresh on the next access.
 * @module calendar.service
 */
export const invalidateCalendarSummariesCache = () => {
  cachedSummaries = null;
};
