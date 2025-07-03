import { NextFunction, Request, Response } from 'express';
import { AppError } from '../middleware/error.middleware';
import {
  createCalendarEvent,
  listCalendarEvents,
} from '../services/googleCalendar.service';
import { calendar_v3 } from 'googleapis';

export const getCalendarEvents = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { calendarId } = request.query;

    if (!calendarId || typeof calendarId !== 'string') {
      const error = new Error('Invalid calendar ID') as AppError;
      error.status = 400;
      return next(error);
    }

    const events = await listCalendarEvents(calendarId);
    response.json(events);
  } catch (error) {
    next(error);
  }
};

export const postCalendarEvent = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { calendarId } = request.query;
    const event = request.body as calendar_v3.Schema$Event;

    if (!calendarId || typeof calendarId !== 'string') {
      const error = new Error('Invalid calendar ID') as AppError;
      error.status = 400;
      return next(error);
    }

    if (!event || typeof event !== 'object') {
      const error = new Error('Invalid event data') as AppError;
      error.status = 400;
      return next(error);
    }

    await createCalendarEvent(calendarId, event);
    response.status(201).send();
  } catch (error) {
    next(error);
  }
};
