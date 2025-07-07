import { calendar_v3 } from 'googleapis';
import { getCalendarAliasMap } from './calendarCache.service';
import * as googleCalendar from './googleCalendar.service';
import { invalidateCalendarEventsCache } from './events.service';

export const createAndSyncCalendarEvent = async (
  alias: string,
  event: calendar_v3.Schema$Event,
) => {
  const calendarAliasMap = await getCalendarAliasMap();
  const calendarId = calendarAliasMap[alias];

  await googleCalendar.createCalendarEvent(calendarId, event);

  invalidateCalendarEventsCache();
  return event;
};
