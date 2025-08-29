import { z } from 'zod';
import { RequestHandler } from 'express';
import AppError from '../utils/errors';

const nonEmptyObject = z
  .record(z.unknown())
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'Request body cannot be empty',
  });

const requireRequestBody: RequestHandler = (request, _response, next) => {
  const result = nonEmptyObject.safeParse(request.body);
  if (!result.success) {
    return next(AppError.badRequest('Invalid request body'));
  }
  next();
};

export default requireRequestBody;
