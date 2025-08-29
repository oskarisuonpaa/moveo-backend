import { calendar_v3 } from 'googleapis';
import { serviceCalendar } from './googleServiceClient';
import AppError from '../../utils/errors';

/**
 * Fetches a list of calendar events for a given calendar ID.
 * @returns A promise that resolves to an array of calendar events.
 * @module googleCalendar.service
 */
export const listCalendarEvents = async (
  calendarId: string,
): Promise<calendar_v3.Schema$Event[]> => {
  const { data: eventList } = await serviceCalendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  return eventList.items ?? [];
};

/**
 * Fetches a single calendar event by its ID.
 * @param calendarId - The ID of the calendar.
 * @param eventId - The ID of the event.
 * @returns The event data or null if not found.
 * @module googleCalendar.service
 */
export const singleCalendarEvent = async (
  calendarId: string,
  eventId: string,
): Promise<calendar_v3.Schema$Event | null> => {
  const { data: event } = await serviceCalendar.events.get({
    calendarId,
    eventId,
  });
  return event || null;
};

/**
 * Creates a new calendar event.
 * @param calendarId - The ID of the calendar where the event will be created.
 * @param event - The event data to be created.
 * @returns A promise that resolves when the event is created.
 * @module googleCalendar.service
 */
export const createCalendarEvent = async (
  calendarId: string,
  event: calendar_v3.Schema$Event,
): Promise<void> => {
  await serviceCalendar.events.insert({
    calendarId,
    requestBody: event,
  });
};

/**
 * Updates an existing calendar event.
 * @param calendarId - The ID of the calendar containing the event.
 * @param eventId - The ID of the event to be updated.
 * @param event - The updated event data.
 * @returns A promise that resolves when the event is updated.
 * @module googleCalendar.service
 */
export const updateCalendarEvent = async (
  calendarId: string,
  eventId: string,
  event: calendar_v3.Schema$Event,
): Promise<void> => {
  await serviceCalendar.events.update({
    calendarId,
    eventId,
    requestBody: event,
  });
};

/**
 * Patches an existing calendar event to update attendees.
 * @param calendarId - The ID of the calendar containing the event.
 * @param eventId - The ID of the event to be patched.
 * @param attendees - An array of attendee email addresses.
 * @returns A promise that resolves when the event is patched.
 * @module googleCalendar.service
 */
export const patchCalendarEvent = async (
  calendarId: string,
  eventId: string,
  attendees: string[],
): Promise<void> => {
  await serviceCalendar.events.patch({
    calendarId,
    eventId,
    requestBody: {
      extendedProperties: { private: { attendees: attendees.join(';') } },
    },
  });
};

/**
 * Removes a calendar event by its ID.
 * @param calendarId - The ID of the calendar containing the event.
 * @param eventId - The ID of the event to be removed.
 * @returns A promise that resolves when the event is deleted.
 * @module googleCalendar.service
 */
export const removeCalendarEvent = async (
  calendarId: string,
  eventId: string,
): Promise<void> => {
  await serviceCalendar.events.delete({
    calendarId,
    eventId,
  });
};

/**
 * Fetches a list of calendars accessible by the service account.
 * @returns A promise that resolves to an array of calendar list entries.
 * @module googleCalendar.service
 */
export const getCalendarList = async (): Promise<
  calendar_v3.Schema$CalendarListEntry[]
> => {
  try {
    const { data: calendarList } = await serviceCalendar.calendarList.list();
    return calendarList.items ?? [];
  } catch (error) {
    // adding more descriptive error logging
    throw AppError.internal('Failed to fetch calendar list', error);
  }
};

/**
 * Fetches a calendar by its ID.
 * @param calendarId - The ID of the calendar to fetch.
 * @returns The calendar data or null if not found.
 * @module googleCalendar.service
 */
export const getCalendar = async (
  calendarId: string,
): Promise<calendar_v3.Schema$Calendar | null> => {
  const { data: calendar } = await serviceCalendar.calendars.get({
    calendarId,
  });
  return calendar || null;
};

/**
 * Creates a new calendar.
 * @param calendarData - The data for the new calendar.
 * @returns A promise that resolves to the created calendar.
 * @module googleCalendar.service
 */
export const createCalendar = async (
  calendarData: calendar_v3.Schema$Calendar,
): Promise<calendar_v3.Schema$Calendar> => {
  const { data: calendar } = await serviceCalendar.calendars.insert({
    requestBody: calendarData,
  });

  return calendar;
};

/**
 * Deletes a calendar by its ID.
 * @param calendarId - The ID of the calendar to delete.
 * @returns A promise that resolves when the calendar is deleted.
 * @module googleCalendar.service
 */
export const removeCalendar = async (calendarId: string): Promise<void> => {
  await serviceCalendar.calendars.delete({
    calendarId,
  });
};
