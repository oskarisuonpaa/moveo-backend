import { NextFunction, Request, Response } from 'express';
import { badRequest } from '@utils/errors';

const requireEventId = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { eventId } = request.params;
  if (!eventId || typeof eventId !== 'string') {
    return next(badRequest('Invalid event ID'));
  }
  next();
};

export default requireEventId;
