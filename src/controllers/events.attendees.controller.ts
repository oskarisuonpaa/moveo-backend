import { RequestHandler } from 'express';
import { AppError } from '../utils/errors';
import { successResponse } from '../utils/responses';
import {
  addAttendeeToEvent,
  removeAttendeeFromEvent,
} from '../services/events.attendees.service';
import { asyncHandler } from '../utils/asyncHandler';

export const attendEvent: RequestHandler = asyncHandler(async (req, res) => {
  const { alias, eventId } = req.params;
  const { email } = req.body as { email: string };

  if (!email || typeof email !== 'string') {
    throw new AppError('A valid email is required', 400);
  }

  await addAttendeeToEvent(alias, eventId, email);
  successResponse(res, null, 200);
});

export const unattendEvent: RequestHandler = asyncHandler(async (req, res) => {
  const { alias, eventId, email } = req.params;

  if (!email || typeof email !== 'string') {
    throw new AppError('A valid email is required', 400);
  }

  await removeAttendeeFromEvent(alias, eventId, email);
  successResponse(res, null, 200);
});
