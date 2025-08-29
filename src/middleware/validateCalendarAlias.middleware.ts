import AppError from '../utils/errors';
import { NextFunction, Request, Response } from 'express';

const requireCalendarAlias = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { alias } = request.params;
  if (!alias || typeof alias !== 'string') {
    return next(AppError.badRequest('Invalid calendar alias'));
  }
  next();
};

export default requireCalendarAlias;
