import { RequestHandler } from 'express';
import { AppError } from '../middleware/error.middleware';
import { calendar_v3 } from 'googleapis';
import {
  getCalendarEventById,
  getCalendarEventsByCalendarAlias,
} from '../services/events.service';
import { createAndSyncCalendarEvent } from '../services/eventManagement.service';
import { sanitizeGoogleCalendarEventFormat } from '../utils/sanitizeGoogleCalendarEventFormat';

export const getCalendarEvents: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const { alias } = request.params;
    const rawData = await getCalendarEventsByCalendarAlias(alias);
    const data = rawData.map((event) =>
      sanitizeGoogleCalendarEventFormat(event),
    );
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
    const rawData = await getCalendarEventById(alias, eventId);
    const data = sanitizeGoogleCalendarEventFormat(rawData);
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
  const { alias } = request.params;
  const { start, end, summary, description } = request.body as {
    start: string;
    end: string;
    summary?: string;
    description?: string;
  };

  if (!alias || typeof alias !== 'string') {
    const error = new Error('Invalid calendar alias') as AppError;
    error.status = 400;
    return next(error);
  }

  if (!start || !end || typeof start !== 'string' || typeof end !== 'string') {
    const error = new Error('Invalid event dates') as AppError;
    error.status = 400;
    return next(error);
  }

  const event: calendar_v3.Schema$Event = {
    start: { dateTime: start },
    end: { dateTime: end },
    summary: summary || 'No Title',
    description: description || 'No Description',
  };

  try {
    const newEvent = await createAndSyncCalendarEvent(alias, event);
    response.status(201).json({ data: newEvent });
  } catch (error) {
    next(error);
  }
};
