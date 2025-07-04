import { invalidateCalendarSummariesCache } from './calendar.service';
import { invalidateCalendarAliasCache } from './calendarCache.service';
import * as googleCalendar from './googleCalendar.service';

export const createAndSyncCalendar = async (alias: string) => {
  const calendarData = {
    summary: alias,
    timeZone: 'Europe/Helsinki',
  };

  const calendar = await googleCalendar.createCalendar(calendarData);

  invalidateCalendarAliasCache();
  invalidateCalendarSummariesCache();

  return calendar;
};
