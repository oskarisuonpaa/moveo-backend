import { AppError as MiddlewareError } from '../middleware/error.middleware';

export class AppError extends Error implements MiddlewareError {
  status?: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (msg: string): never => {
  throw new AppError(msg, 400);
};

export const notFound = (msg: string): never => {
  throw new AppError(msg, 404);
};
