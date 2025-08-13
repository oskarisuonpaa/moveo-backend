import config from '@config';
import { google } from 'googleapis';
import path from 'path';

/**
 * Google Service Account Authentication
 * This service account is used to access Google Calendar API.
 * @module googleServiceClient
 */
const serviceAuth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, config.serviceAccount),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

/**
 * Google Calendar Service Client
 * This client is used to interact with the Google Calendar API.
 * @module googleServiceClient
 */
export const serviceCalendar = google.calendar({
  version: 'v3',
  auth: serviceAuth,
});
