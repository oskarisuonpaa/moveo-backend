import { RequestHandler } from 'express';
import { calendar_v3 } from 'googleapis';
import {
  getCalendarEventById,
  getCalendarEventsByCalendarAlias,
} from '@services/events/events.service';
import { createAndSyncCalendarEvent } from '@services/events/eventManagement.service';
import sanitizeGoogleCalendarEventFormat from '@utils/sanitizeGoogleCalendarEventFormat';
import { successResponse } from '@utils/responses';
import { asyncHandler } from '@utils/asyncHandler';
import AppError from '@utils/errors';

export const getCalendarEvents: RequestHandler = asyncHandler(
  async (request, response) => {
    const { alias } = request.params;
    const rawData = await getCalendarEventsByCalendarAlias(alias);
    const data = rawData.map((event) =>
      sanitizeGoogleCalendarEventFormat(event),
    );
    successResponse(response, data);
  },
);

export const getCalendarEvent: RequestHandler = asyncHandler(
  async (request, response) => {
    const { alias, eventId } = request.params;
    const rawData = await getCalendarEventById(alias, eventId);
    const data = sanitizeGoogleCalendarEventFormat(rawData);
    successResponse(response, data);
  },
);

export const postCalendarEvent: RequestHandler = asyncHandler(
  async (request, response) => {
    const { alias } = request.params;
    const { start, end, summary, description, location, maxAttendees } =
      request.body as {
        start: string;
        end: string;
        summary?: string;
        description?: string;
        location?: string;
        maxAttendees?: number;
      };

    if (
      !start ||
      !end ||
      typeof start !== 'string' ||
      typeof end !== 'string'
    ) {
      throw AppError.badRequest('Invalid event dates');
    }

    const event: calendar_v3.Schema$Event = {
      start: { dateTime: start },
      end: { dateTime: end },
      summary: summary || 'No Title',
      description: description || 'No Description',
      location: location || undefined,
      extendedProperties: {
        private: {
          maxAttendees: maxAttendees ? String(maxAttendees) : '',
          attendees: '',
        },
      },
    };

    await createAndSyncCalendarEvent(alias, event);
    successResponse(response, null, 201);
  },
);
