import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { unauthorized } from '@utils/errors';

export interface AuthRequest extends Omit<Request, 'user'> {
  user?: {
    id: number;
    email: string;
  };
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
    return next(unauthorized('Authentication token is missing'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded
    ) {
      request.user = {
        id: (decoded as { userId: number }).userId,
        email: (decoded as { email: string }).email,
      };
      return next();
    }
    next(unauthorized('Invalid token payload'));
  } catch {
    return next(unauthorized('Invalid or expired token'));
  }
};
