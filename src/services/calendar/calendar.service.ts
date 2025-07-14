import { AppError } from '@utils/errors';
import { getCalendarAliasMap } from './calendarCache.service';

let cachedSummaries: string[] | null = null;

export const getCalendarSummaries = async (): Promise<string[]> => {
  if (cachedSummaries) {
    return cachedSummaries;
  }

  const aliasMap = await getCalendarAliasMap();
  const summaries = Object.entries(aliasMap).map(([alias]) => alias);

  if (summaries.length === 0) {
    throw new AppError('No calendars found', 404);
  }

  cachedSummaries = summaries;
  return summaries;
};

export const invalidateCalendarSummariesCache = () => {
  cachedSummaries = null;
};
