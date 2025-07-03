import { calendar_v3, google } from 'googleapis';
import config from '../config';

const auth = new google.auth.GoogleAuth({
  keyFile: config.serviceAccount,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

export const calendar = google.calendar({
  version: 'v3',
  auth,
});

export const listCalendarEvents = async (calendarId: string) => {
  const response = await calendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  return response.data.items || [];
};

export const createCalendarEvent = async (
  calendarId: string,
  event: calendar_v3.Schema$Event,
) => {
  await calendar.events.insert({
    calendarId,
    requestBody: event,
  });
};
