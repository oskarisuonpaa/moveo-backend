import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import errorHandler from './middleware/error.middleware';
import calendarRouter from './routes/calendar.route';
import eventsRouter from './routes/events.route';
import attendeesRouter from './routes/events.attendees.route';
import { logger } from './utils/logger';
import { AppError } from './utils/errors';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.trace(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

app.use('/api/calendars', calendarRouter);
app.use('/api/events', eventsRouter);
app.use('/api/events/attendees', attendeesRouter);

app.use((_request: Request, _response: Response, next: NextFunction) => {
  const error = new AppError('Not Found', 404);
  next(error);
});

app.use(errorHandler);

export default app;
