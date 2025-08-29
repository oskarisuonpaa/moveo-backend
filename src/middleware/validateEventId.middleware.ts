import AppError from '../utils/errors';
import { NextFunction, Request, Response } from 'express';

const requireEventId = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { eventId } = request.params;
  if (!eventId || typeof eventId !== 'string') {
    return next(AppError.badRequest('Invalid event ID'));
  }
  next();
};

export default requireEventId;
