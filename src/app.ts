import express, { NextFunction, Request, Response } from 'express';
import { AppError, errorHandler } from './middleware/error.middleware';
import exampleRouter from './routes/example.route';
import { logger } from './utils/logger';

const app = express();

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.trace(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

app.use('/api/example', exampleRouter);

app.use((_request: Request, _response: Response, next: NextFunction) => {
  const error: AppError = new Error('Not Found') as AppError;
  error.status = 404;
  next(error);
});

app.use(errorHandler);

export default app;
