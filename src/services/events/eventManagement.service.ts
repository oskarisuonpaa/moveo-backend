import { calendar_v3 } from 'googleapis';
import * as googleCalendar from '../google/googleCalendar.service';
import { calendarAliasToId } from '@services/calendar/calendarCache.service';
import { invalidateCalendarEventsCache } from './events.service';

export const createAndSyncCalendarEvent = async (
  alias: string,
  event: calendar_v3.Schema$Event,
) => {
  const calendarId = await calendarAliasToId(alias);

  await googleCalendar.createCalendarEvent(calendarId, event);

  invalidateCalendarEventsCache(alias);
};
