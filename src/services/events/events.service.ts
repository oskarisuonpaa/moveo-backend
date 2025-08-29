import { calendar_v3 } from 'googleapis';
import { calendarAliasToId } from '../../services/calendar/calendarCache.service';
import { listCalendarEvents } from '../../services/google/googleCalendar.service';
import NodeCache from 'node-cache';
import AppError from '../../utils/errors';

const EVENT_TTL_SECONDS = 5 * 60; // 5 minutes

const eventCache = new NodeCache({ stdTTL: EVENT_TTL_SECONDS });

/**
 * Retrieves calendar events for a given calendar alias.
 * This function checks the cache first and fetches from Google if not cached.
 * @param alias - The alias of the calendar.
 * @returns A promise that resolves to an array of calendar events.
 * @module events.service
 */
export const getCalendarEventsByCalendarAlias = async (
  alias: string,
): Promise<calendar_v3.Schema$Event[]> => {
  const cacheKey = `events:${alias}`;
  const cachedEvents = eventCache.get(cacheKey) as calendar_v3.Schema$Event[];
  if (cachedEvents) {
    return cachedEvents;
  }

  const calendarId = await calendarAliasToId(alias);

  const events = await listCalendarEvents(calendarId);
  eventCache.set(cacheKey, events);

  return events;
};

/**
 * Retrieves a single calendar event by its ID from a specific calendar alias.
 * This function fetches the events for the alias and finds the event by ID.
 * @param alias - The alias of the calendar.
 * @param eventId - The ID of the event to retrieve.
 * @returns A promise that resolves to the calendar event.
 * @module events.service
 */
export const getCalendarEventById = async (
  alias: string,
  eventId: string,
): Promise<calendar_v3.Schema$Event> => {
  const events = await getCalendarEventsByCalendarAlias(alias);
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    throw AppError.notFound(
      `Event with ID ${eventId} not found in calendar ${alias}`,
    );
  }

  return event;
};

/**
 * Invalidates the cache for calendar events associated with a specific alias.
 * This function removes the cached events, forcing a refresh on the next access.
 * @param alias - The alias of the calendar whose events cache should be invalidated.
 * @module events.service
 */
export const invalidateCalendarEventsCache = (alias: string) => {
  const cacheKey = `events:${alias}`;
  eventCache.del(cacheKey);
};
