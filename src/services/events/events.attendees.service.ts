import AppError from '@utils/errors';
import { patchCalendarEvent } from '@services/google/googleCalendar.service';
import {
  getCalendarEventById,
  invalidateCalendarEventsCache,
} from './events.service';
import { calendarAliasToId } from '@services/calendar/calendarCache.service';

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
