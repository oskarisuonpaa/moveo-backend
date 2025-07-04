import { RequestHandler } from 'express';
import { AppError } from '../middleware/error.middleware';
import { createCalendarEvent } from '../services/googleCalendar.service';
import { calendar_v3 } from 'googleapis';
import {
  getCalendarEventById,
  getCalendarEventsByCalendarAlias,
} from '../services/events.service';

export const getCalendarEvents: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const { alias } = request.params;
    const data = await getCalendarEventsByCalendarAlias(alias);
    response.status(200).json({ data });
  } catch (error) {
    const appError = error as AppError;
    appError.status = appError.status || 404;
    next(appError);
  }
};

export const getCalendarEvent: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const { alias, eventId } = request.params;
    const data = await getCalendarEventById(alias, eventId);
    response.status(200).json({ data });
  } catch (error) {
    const appError = error as AppError;
    appError.status = appError.status || 404;
    next(appError);
  }
};

export const postCalendarEvent: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const { alias } = request.params;
    const event = request.body as calendar_v3.Schema$Event;

    if (!event || typeof event !== 'object') {
      const error = new Error('Invalid event data') as AppError;
      error.status = 400;
      return next(error);
    }

    const newEvent = await createCalendarEvent(alias, event);
    response.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};
