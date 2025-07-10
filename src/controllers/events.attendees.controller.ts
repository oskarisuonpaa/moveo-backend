import { RequestHandler } from 'express';
import { successResponse } from '@utils/responses';
import {
  addAttendeeToEvent,
  removeAttendeeFromEvent,
} from '@services/events/events.attendees.service';
import { asyncHandler } from '@utils/asyncHandler';
import { OAuth2Client } from 'google-auth-library';

export const attendEvent: RequestHandler = asyncHandler(
  async (request, response) => {
    const { alias, eventId } = request.params;
    const googleClient = request.googleClient as OAuth2Client;
    const { email } = request.user as { email: string };

    await addAttendeeToEvent(alias, eventId, email, googleClient);
    successResponse(response, null, 200);
  },
);

export const unattendEvent: RequestHandler = asyncHandler(
  async (request, response) => {
    const { alias, eventId } = request.params;
    const googleClient = request.googleClient as OAuth2Client;
    const { email } = request.user as { email: string };

    await removeAttendeeFromEvent(alias, eventId, email, googleClient);
    successResponse(response, null, 200);
  },
);
