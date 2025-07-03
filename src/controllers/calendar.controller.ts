import { RequestHandler } from 'express';
import {
  calendar,
  createCalendar,
  removeCalendar,
} from '../services/googleCalendar.service';
import { AppError } from '../middleware/error.middleware';
import { calendar_v3 } from 'googleapis';

export interface CalendarSummary {
  calendarId: string;
  alias: string;
}

export const getCalendars: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    const calendarResponse = await calendar.calendarList.list();
    const { items: calendars = [] } = calendarResponse.data;

    if (!calendars || calendars.length === 0) {
      const error = new Error('No calendars found') as AppError;
      error.status = 404;
      return next(error);
    }

    const data: CalendarSummary[] = calendars.map(
      (calendar: calendar_v3.Schema$CalendarListEntry) => ({
        calendarId: calendar.id as string,
        alias: calendar.summary as string,
      }),
    );

    response.status(200).json({ data });
  } catch (error) {
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

  const calendarData = {
    summary: alias,
    timeZone: 'Europe/Helsinki',
  };

  try {
    const calendarResponse = await createCalendar(calendarData);
    response.status(201).json({ data: calendarResponse });
  } catch (error) {
    next(error);
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
