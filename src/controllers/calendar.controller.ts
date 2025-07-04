import { RequestHandler } from 'express';
import { calendar, removeCalendar } from '../services/googleCalendar.service';
import { AppError } from '../middleware/error.middleware';
import { getCalendarSummaries } from '../services/calendar.service';
import { createAndSyncCalendar } from '../services/calendarManagement.service';

export interface CalendarSummary {
  calendarId: string;
  alias: string;
}

export const getCalendars: RequestHandler = async (_req, res, next) => {
  try {
    const data = await getCalendarSummaries();
    res.status(200).json({ data });
  } catch (err) {
    const error = err as AppError;
    error.status = error.status || 404;
    next(error);
  }
};

export const getCalendar: RequestHandler = async (request, response, next) => {
  const { calendarId } = request.params;
  try {
    const calendarResponse = await calendar.calendars.get({
      calendarId,
    });

    if (!calendarResponse.data) {
      const error = new Error('Calendar not found') as AppError;
      error.status = 404;
      return next(error);
    }

    const data: CalendarSummary = {
      calendarId: calendarResponse.data.id as string,
      alias: calendarResponse.data.summary as string,
    };

    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

interface PostCalendarBody {
  alias: string;
}

export const postCalendar: RequestHandler<
  object,
  unknown,
  PostCalendarBody,
  unknown
> = async (request, response, next) => {
  const { alias } = request.body;

  if (!alias || typeof alias !== 'string') {
    const error = new Error('Invalid calendar alias') as AppError;
    error.status = 400;
    return next(error);
  }

  try {
    const calendar = await createAndSyncCalendar(alias);
    response.status(201).json({ data: calendar });
  } catch (error) {
    const appError = error as AppError;
    appError.status = appError.status || 500;
    next(appError);
  }
};

export const deleteCalendar: RequestHandler = async (
  request,
  response,
  next,
) => {
  const { calendarId } = request.params;
  try {
    await removeCalendar(calendarId);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
