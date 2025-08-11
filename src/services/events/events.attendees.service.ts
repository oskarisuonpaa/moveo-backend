import AppError from '@utils/errors';
import { patchCalendarEvent } from '@services/google/googleCalendar.service';
import {
  getCalendarEventById,
  invalidateCalendarEventsCache,
} from './events.service';
import { calendarAliasToId } from '@services/calendar/calendarCache.service';

/**
 * Adds an attendee to a calendar event.
 * This function checks if the event is full before adding the attendee.
 * @param alias - The alias of the calendar where the event exists.
 * @param eventId - The ID of the event to which the attendee will be added.
 * @param email - The email of the attendee to be added.
 * @throws {AppError} If the event is full.
 * @module events.attendees.service
 */
export const addAttendeeToEvent = async (
  alias: string,
  eventId: string,
  email: string,
): Promise<void> => {
  const calendarId = await calendarAliasToId(alias);

  const event = await getCalendarEventById(alias, eventId);

  const max = event.extendedProperties?.private?.maxAttendees
    ? parseInt(event.extendedProperties.private.maxAttendees, 10)
    : Infinity;

  const count =
    event.attendees?.filter(
      (attendee) => attendee.responseStatus !== 'declined',
    ).length ?? 0;

  if (count >= max) {
    throw AppError.conflict('Event is full');
  }

  const attendees = [...(event.attendees || []), { email }];
  const attendeeEmails = attendees.map((attendee) => attendee.email ?? '');

  await patchCalendarEvent(calendarId, eventId, attendeeEmails);

  invalidateCalendarEventsCache(alias);
};

/**
 * Removes an attendee from a calendar event.
 * This function updates the event's attendees list and invalidates the cache.
 * @param alias - The alias of the calendar where the event exists.
 * @param eventId - The ID of the event from which the attendee will be removed.
 * @param email - The email of the attendee to be removed.
 * @module events.attendees.service
 */
export async function removeAttendeeFromEvent(
  alias: string,
  eventId: string,
  email: string,
) {
  const calendarId = await calendarAliasToId(alias);

  const event = await getCalendarEventById(alias, eventId);
  const attendees = event.extendedProperties?.private?.attendees;

  const parsedAttendees = attendees
    ? attendees.split(';').filter((attendee) => attendee !== email)
    : [];

  const attendeeEmails = parsedAttendees.map((attendee) => attendee ?? '');

  await patchCalendarEvent(calendarId, eventId, attendeeEmails);

  invalidateCalendarEventsCache(alias);
}
