import { NextFunction, Request, Response } from 'express';
import { AppError } from './error.middleware';

export const requireCalendarId = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { calendarId } = request.params;

  if (!calendarId || typeof calendarId !== 'string') {
    const error = new Error('Invalid calendar ID') as AppError;
    error.status = 400;
    return next(error);
  }

  next();
};
