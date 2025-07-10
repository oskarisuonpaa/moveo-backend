import { calendar_v3, google } from 'googleapis';
import { serviceCalendar } from './googleServiceClient';
import { OAuth2Client } from 'google-auth-library';

export const listCalendarEvents = async (
  calendarId: string,
): Promise<calendar_v3.Schema$Event[]> => {
  const response = await serviceCalendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  return response.data.items ?? [];
};

export const singleCalendarEvent = async (
  calendarId: string,
  eventId: string,
): Promise<calendar_v3.Schema$Event | null> => {
  const response = await serviceCalendar.events.get({
    calendarId,
    eventId,
  });
  return response.data || null;
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
  googleClient: OAuth2Client,
  attendees: calendar_v3.Schema$EventAttendee[],
): Promise<void> => {
  const calendar = google.calendar({ version: 'v3', auth: googleClient });
  await calendar.events.patch({
    calendarId,
    eventId,
    sendUpdates: 'all',
    requestBody: { attendees },
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
  const response = await serviceCalendar.calendarList.list();
  return response.data.items ?? [];
};

export const getCalendar = async (
  calendarId: string,
): Promise<calendar_v3.Schema$Calendar | null> => {
  const response = await serviceCalendar.calendars.get({
    calendarId,
  });
  return response.data || null;
};

export const createCalendar = async (
  calendarData: calendar_v3.Schema$Calendar,
): Promise<calendar_v3.Schema$Calendar> => {
  const response = await serviceCalendar.calendars.insert({
    requestBody: calendarData,
  });
  return response.data;
};

export const removeCalendar = async (calendarId: string): Promise<void> => {
  await serviceCalendar.calendars.delete({
    calendarId,
  });
};
