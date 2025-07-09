import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AppError } from '@utils/errors';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticateJWT = (
  request: AuthRequest,
  _response: Response,
  next: NextFunction,
) => {
  const token =
    (request.cookies as { token?: string }).token ||
    request.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(new AppError('Authentication token is missing', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded
    ) {
      request.userId = (decoded as { userId: number }).userId;
      return next();
    }
    next(new AppError('Invalid token payload', 401));
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
};
