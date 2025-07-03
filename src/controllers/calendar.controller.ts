import { NextFunction, Request, Response } from 'express';
import { calendar } from '../services/googleCalendar.service';

export const getCalendars = async (
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const calendarResponse = await calendar.calendarList.list();
    response.status(200).json({ data: calendarResponse.data.items });
  } catch (error) {
    next(error);
  }
};
