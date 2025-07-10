import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { unauthorized } from '@utils/errors';

export interface AuthRequest extends Omit<Request, 'user'> {
  user?: {
    id: string;
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
      'userId' in decoded &&
      'email' in decoded
    ) {
      request.user = {
        id: (decoded as { userId: string }).userId,
        email: (decoded as { email: string }).email,
      };
      return next();
    }
    return next(unauthorized('Invalid token payload'));
  } catch {
    return next(unauthorized('Invalid or expired token'));
  }
};
