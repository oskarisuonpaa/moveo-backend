import { getCalendarAliasMap } from './calendarCache.service';

export interface CalendarSummary {
  calendarId: string;
  alias: string;
}

let cachedSummaries: CalendarSummary[] | null = null;

export const getCalendarSummaries = async (): Promise<CalendarSummary[]> => {
  if (cachedSummaries) {
    return cachedSummaries;
  }

  const aliasMap = await getCalendarAliasMap();
  const summaries = Object.entries(aliasMap).map(([alias, calendarId]) => ({
    alias,
    calendarId,
  }));

  if (summaries.length === 0) {
    throw new Error('No calendars found');
  }

  cachedSummaries = summaries;
  return summaries;
};

export const getCalendarSummaryByAlias = async (
  alias: string,
): Promise<CalendarSummary> => {
  const summaries = await getCalendarSummaries();
  const summary = summaries.find((s) => s.alias === alias);
  if (!summary) {
    throw new Error(`Calendar with alias "${alias}" not found`);
  }
  return summary;
};

export const invalidateCalendarSummariesCache = () => {
  cachedSummaries = null;
};
