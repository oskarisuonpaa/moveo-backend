import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from '@middleware/error.middleware';
import authenticateJWT from '@middleware/authenticateJWT.middleware';
import calendarRouter from '@routes/calendar.routes';
import eventsRouter from '@routes/events.routes';
import attendeesRouter from '@routes/events.attendees.routes';
import authRouter from '@routes/auth.routes';
import logger from '@utils/logger';
import { AppError } from '@utils/errors';
import config from '@config';
import attachGoogleClient from '@middleware/attachGoogleClient.middleware';
import verificationRouter from '@routes/verification.routes';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.trace(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/auth', authRouter);

app.use(authenticateJWT);
app.use(attachGoogleClient);

app.use('/api/calendars', calendarRouter);
app.use('/api/events', eventsRouter);
app.use('/api/events', attendeesRouter);
app.use('/verification', verificationRouter);

//Temp
app.post('/logout', (_req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
  });
  res.sendStatus(204);
});

app.use((_request: Request, _response: Response, next: NextFunction) => {
  const error = new AppError('Not Found', 404);
  next(error);
});

app.use(errorHandler);

export default app;
