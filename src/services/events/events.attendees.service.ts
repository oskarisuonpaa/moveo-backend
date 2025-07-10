import { AppError } from '@utils/errors';
import { patchCalendarEvent } from '@services/google/googleCalendar.service';
import {
  getCalendarEventById,
  invalidateCalendarEventsCache,
} from './events.service';
import { calendarAliasToId } from '@services/calendar/calendarCache.service';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

const ensureUserHasCalendar = async (
  calendarId: string,
  authClient: OAuth2Client,
) => {
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  try {
    await calendar.calendarList.get({ calendarId });
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: number }).code === 404
    ) {
      await calendar.calendarList.insert({
        requestBody: { id: calendarId },
      });
      return;
    }
    throw error;
  }

  return calendarId;
};

export const addAttendeeToEvent = async (
  alias: string,
  eventId: string,
  email: string,
  googleClient: OAuth2Client,
): Promise<void> => {
  const calendarId = await calendarAliasToId(alias);

  await ensureUserHasCalendar(calendarId, googleClient);

  const calendarAsUser = google.calendar({ version: 'v3', auth: googleClient });
  await calendarAsUser.events.get({ calendarId, eventId });

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

  await patchCalendarEvent(calendarId, eventId, googleClient, attendees);

  invalidateCalendarEventsCache(alias);
};

export async function removeAttendeeFromEvent(
  alias: string,
  eventId: string,
  email: string,
  googleClient: OAuth2Client,
) {
  const calendarId = await calendarAliasToId(alias);

  await ensureUserHasCalendar(calendarId, googleClient);

  const calendarAsUser = google.calendar({ version: 'v3', auth: googleClient });
  await calendarAsUser.events.get({ calendarId, eventId });

  const event = await getCalendarEventById(alias, eventId);
  const attendees = event.attendees?.filter((a) => a.email !== email) ?? [];

  await patchCalendarEvent(calendarId, eventId, googleClient, attendees);

  invalidateCalendarEventsCache(alias);
}
