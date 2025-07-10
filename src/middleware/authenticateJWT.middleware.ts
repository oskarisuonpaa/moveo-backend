import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { unauthorized } from '@utils/errors';

const authenticateJWT: RequestHandler = (request, response, next) => {
  const token =
    (request.cookies as { token?: string }).token ||
    request.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(unauthorized('Authentication token is missing'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as Record<
      string,
      unknown
    >;
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded &&
      'email' in decoded
    ) {
      request.user = {
        id: decoded.userId as string,
        email: decoded.email as string,
      };
      return next();
    }
    return next(unauthorized('Invalid token payload'));
  } catch {
    return next(unauthorized('Invalid or expired token'));
  }
};

export default authenticateJWT;
