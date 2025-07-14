import { calendar_v3 } from 'googleapis';
import { serviceCalendar } from './googleServiceClient';

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

export const createCalendarEvent = async (
  calendarId: string,
  event: calendar_v3.Schema$Event,
): Promise<void> => {
  await serviceCalendar.events.insert({
    calendarId,
    requestBody: event,
  });
};

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

export const removeCalendarEvent = async (
  calendarId: string,
  eventId: string,
): Promise<void> => {
  await serviceCalendar.events.delete({
    calendarId,
    eventId,
  });
};

export const getCalendarList = async (): Promise<
  calendar_v3.Schema$CalendarListEntry[]
> => {
  const { data: calendarList } = await serviceCalendar.calendarList.list();
  return calendarList.items ?? [];
};

export const getCalendar = async (
  calendarId: string,
): Promise<calendar_v3.Schema$Calendar | null> => {
  const { data: calendar } = await serviceCalendar.calendars.get({
    calendarId,
  });
  return calendar || null;
};

export const createCalendar = async (
  calendarData: calendar_v3.Schema$Calendar,
): Promise<calendar_v3.Schema$Calendar> => {
  const { data: calendar } = await serviceCalendar.calendars.insert({
    requestBody: calendarData,
  });

  return calendar;
};

export const removeCalendar = async (calendarId: string): Promise<void> => {
  await serviceCalendar.calendars.delete({
    calendarId,
  });
};
