import { NextFunction, Request, Response } from 'express';
import { badRequest } from '@utils/errors';

const requireCalendarAlias = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { alias } = request.params;
  if (!alias || typeof alias !== 'string') {
    return next(badRequest('Invalid calendar alias'));
  }
  next();
};

export default requireCalendarAlias;
