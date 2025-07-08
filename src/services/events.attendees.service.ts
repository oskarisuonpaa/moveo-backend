import { calendarAliasToId } from './calendarCache.service';
import {
  getCalendarEventById,
  invalidateCalendarEventsCache,
} from './events.service';
import { AppError } from '../utils/errors';
import { patchCalendarEvent } from './googleCalendar.service';

export const addAttendeeToEvent = async (
  alias: string,
  eventId: string,
  email: string,
): Promise<void> => {
  const event = await getCalendarEventById(alias, eventId);

  const max = event.extendedProperties?.private?.maxAttendees
    ? parseInt(event.extendedProperties.private.maxAttendees, 10)
    : Infinity;

  const count =
    event.attendees?.filter(
      (attendee) => attendee.responseStatus !== 'declined',
    ).length ?? 0;

  if (count >= max) {
    throw new AppError('Event is full', 409);
  }

  const attendees = [...(event.attendees || []), { email }];
  await patchCalendarEvent(await calendarAliasToId(alias), eventId, {
    attendees,
  });

  invalidateCalendarEventsCache(alias);
};

export async function removeAttendeeFromEvent(
  alias: string,
  eventId: string,
  email: string,
) {
  const event = await getCalendarEventById(alias, eventId);
  const attendees = event.attendees?.filter((a) => a.email !== email) ?? [];

  await patchCalendarEvent(await calendarAliasToId(alias), eventId, {
    attendees,
  });

  invalidateCalendarEventsCache(alias);
}
