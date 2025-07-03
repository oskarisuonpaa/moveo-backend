import { z } from 'zod';
import { RequestHandler } from 'express';
import { AppError } from './error.middleware';

const nonEmptyObject = z
  .record(z.unknown())
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'Request body cannot be empty',
  });

export const requireRequestBody: RequestHandler = (
  request,
  _response,
  next,
) => {
  const result = nonEmptyObject.safeParse(request.body);
  if (!result.success) {
    const error = new Error('Invalid request body') as AppError;
    error.status = 400;
    return next(error);
  }

  next();
};
