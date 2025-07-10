import { RequestHandler } from 'express';
import { successResponse } from '@utils/responses';
import {
  addAttendeeToEvent,
  removeAttendeeFromEvent,
} from '@services/events/events.attendees.service';
import { asyncHandler } from '@utils/asyncHandler';

declare module 'express-serve-static-core' {
  interface Request {
    user: { id: number; email: string };
  }
}

export const attendEvent: RequestHandler = asyncHandler(
  async (request, response) => {
    const { alias, eventId } = request.params;
    const email: string = request.user.email;

    await addAttendeeToEvent(alias, eventId, email);
    successResponse(response, null, 200);
  },
);

export const unattendEvent: RequestHandler = asyncHandler(
  async (request, response) => {
    const { alias, eventId } = request.params;
    const email: string = request.user.email;

    await removeAttendeeFromEvent(alias, eventId, email);
    successResponse(response, null, 200);
  },
);
