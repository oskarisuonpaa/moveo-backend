import { NextFunction, Request, Response } from 'express';
import { google } from 'googleapis';
import { AppError } from '../middleware/error.middleware';
import config from '../config/config';

const auth = new google.auth.GoogleAuth({
  keyFile: config.serviceAccount,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});
const calendar = google.calendar({ version: 'v3', auth });

export const getCalendarEvents = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { calendarId } = request.query;

  if (!calendarId || typeof calendarId !== 'string') {
    const error = new Error('Invalid calendar ID') as AppError;
    error.status = 400;
    return next(error);
  }

  try {
    const events = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    response.status(200).json({ data: events.data });
  } catch (error) {
    next(error);
  }
};
