import { calendar_v3, google } from 'googleapis';
import config from '../config';
import path from 'path';

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, config.serviceAccount),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

export const calendar = google.calendar({
  version: 'v3',
  auth,
});

export const listCalendarEvents = async (
  calendarId: string,
): Promise<calendar_v3.Schema$Event[]> => {
  const response = await calendar.events.list({
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
  const response = await calendar.events.get({
    calendarId,
    eventId,
  });
  return response.data || null;
};

export const createCalendarEvent = async (
  calendarId: string,
  event: calendar_v3.Schema$Event,
): Promise<void> => {
  await calendar.events.insert({
    calendarId,
    requestBody: event,
  });
};

export const updateCalendarEvent = async (
  calendarId: string,
  eventId: string,
  event: calendar_v3.Schema$Event,
): Promise<void> => {
  await calendar.events.update({
    calendarId,
    eventId,
    requestBody: event,
  });
};

export const removeCalendarEvent = async (
  calendarId: string,
  eventId: string,
): Promise<void> => {
  await calendar.events.delete({
    calendarId,
    eventId,
  });
};

export const getCalendarList = async (): Promise<
  calendar_v3.Schema$CalendarListEntry[]
> => {
  const response = await calendar.calendarList.list();
  return response.data.items ?? [];
};

export const getCalendar = async (
  calendarId: string,
): Promise<calendar_v3.Schema$Calendar | null> => {
  const response = await calendar.calendars.get({
    calendarId,
  });
  return response.data || null;
};

export const createCalendar = async (
  calendarData: calendar_v3.Schema$Calendar,
): Promise<calendar_v3.Schema$Calendar> => {
  const response = await calendar.calendars.insert({
    requestBody: calendarData,
  });
  return response.data;
};

export const removeCalendar = async (calendarId: string): Promise<void> => {
  await calendar.calendars.delete({
    calendarId,
  });
};
