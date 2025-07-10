import { RequestHandler } from 'express';
import { successResponse } from '@utils/responses';
import {
  addAttendeeToEvent,
  removeAttendeeFromEvent,
} from '@services/events/events.attendees.service';
import { asyncHandler } from '@utils/asyncHandler';

declare module 'express-serve-static-core' {
  interface Request {
    user: { id: string; email: string };
  }
}

export const attendEvent: RequestHandler = asyncHandler(
  async (request, response) => {
    const { alias, eventId } = request.params;
    const { googleClient } = request;

    await addAttendeeToEvent(alias, eventId, googleClient);
    successResponse(response, null, 200);
  },
);

export const unattendEvent: RequestHandler = asyncHandler(
  async (request, response) => {
    const { alias, eventId } = request.params;
    const { googleClient } = request;

    await removeAttendeeFromEvent(alias, eventId, googleClient);
    successResponse(response, null, 200);
  },
);
