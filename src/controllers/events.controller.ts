import { RequestHandler } from 'express';
import { AppError } from '../middleware/error.middleware';
import {
  createCalendarEvent,
  listCalendarEvents,
} from '../services/googleCalendar.service';
import { calendar_v3 } from 'googleapis';

export const getCalendarEvents: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const { calendarId } = request.params;

    const events = await listCalendarEvents(calendarId);
    response.json(events);
  } catch (error) {
    next(error);
  }
};

export const postCalendarEvent: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const { calendarId } = request.params;
    const event = request.body as calendar_v3.Schema$Event;

    if (!event || typeof event !== 'object') {
      const error = new Error('Invalid event data') as AppError;
      error.status = 400;
      return next(error);
    }

    const newEvent = await createCalendarEvent(calendarId, event);
    response.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};
