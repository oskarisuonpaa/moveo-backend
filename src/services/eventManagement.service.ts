import { calendar_v3 } from 'googleapis';
import { calendarAliasToId } from './calendarCache.service';
import * as googleCalendar from './googleCalendar.service';
import { invalidateCalendarEventsCache } from './events.service';

export const createAndSyncCalendarEvent = async (
  alias: string,
  event: calendar_v3.Schema$Event,
) => {
  const calendarId = await calendarAliasToId(alias);

  await googleCalendar.createCalendarEvent(calendarId, event);

  invalidateCalendarEventsCache(alias);
};
