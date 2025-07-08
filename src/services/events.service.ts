import { calendar_v3 } from 'googleapis';
import { calendarAliasToId } from './calendarCache.service';
import { listCalendarEvents } from './googleCalendar.service';
import NodeCache from 'node-cache';
import { AppError } from '../utils/errors';

const EVENT_TTL_SECONDS = 5 * 60; // 5 minutes

const eventCache = new NodeCache({ stdTTL: EVENT_TTL_SECONDS });

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

export const getCalendarEventById = async (
  alias: string,
  eventId: string,
): Promise<calendar_v3.Schema$Event> => {
  const events = await getCalendarEventsByCalendarAlias(alias);
  const event = events.find((e) => e.id === eventId);
  if (!event) {
    throw new AppError(
      `Event with ID ${eventId} not found in calendar ${alias}`,
      404,
    );
  }
  return event;
};

export const invalidateCalendarEventsCache = (alias: string) => {
  const cacheKey = `events:${alias}`;
  eventCache.del(cacheKey);
};
