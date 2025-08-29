import { calendar_v3 } from 'googleapis';
import * as googleCalendar from '../google/googleCalendar.service';
import { calendarAliasToId } from '../../services/calendar/calendarCache.service';
import { invalidateCalendarEventsCache } from './events.service';

/**
 * Creates a new calendar event and synchronizes it with the database.
 * @param alias - The alias of the calendar where the event will be created.
 * @param event - The event data to be created.
 * @returns A promise that resolves when the event is created.
 * @module calendarManagement.service
 */
export const createAndSyncCalendarEvent = async (
  alias: string,
  event: calendar_v3.Schema$Event,
) => {
  const calendarId = await calendarAliasToId(alias);

  await googleCalendar.createCalendarEvent(calendarId, event);

  invalidateCalendarEventsCache(alias);
};
