import config from '@config';
import { google } from 'googleapis';
import path from 'path';

const serviceAuth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, config.serviceAccount),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

export const serviceCalendar = google.calendar({
  version: 'v3',
  auth: serviceAuth,
});
