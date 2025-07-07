import express, { NextFunction, Request, Response } from 'express';
import errorHandler, { AppError } from './middleware/error.middleware';
import calendarRouter from './routes/calendar.route';
import eventsRouter from './routes/events.route';
import { logger } from './utils/logger';

const app = express();

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.trace(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

app.use('/api/calendars', calendarRouter);
app.use('/api/events', eventsRouter);

app.use((_request: Request, _response: Response, next: NextFunction) => {
  const error: AppError = new Error('Not Found') as AppError;
  error.status = 404;
  next(error);
});

app.use(errorHandler);

export default app;
