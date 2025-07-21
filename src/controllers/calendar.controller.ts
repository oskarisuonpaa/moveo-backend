import { RequestHandler } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { badRequest } from '@utils/errors';
import { successResponse } from '@utils/responses';
import { getCalendarSummaries } from '@services/calendar/calendar.service';
import {
  createAndSyncCalendar,
  removeCalendar,
} from '@services/calendar/calendarManagement.service';

export interface CalendarSummary {
  calendarId: string;
  alias: string;
}

export const getCalendars: RequestHandler = asyncHandler(
  async (_request, response) => {
    const data = await getCalendarSummaries();
    successResponse(response, data);
  },
);

interface PostCalendarBody {
  alias: string;
}

export const postCalendar: RequestHandler<
  object,
  unknown,
  PostCalendarBody,
  unknown
> = asyncHandler(async (request, response) => {
  const { alias } = request.body;
  if (!alias || typeof alias !== 'string') {
    badRequest('Invalid calendar alias');
  }

  const newCalendar = await createAndSyncCalendar(alias);
  successResponse(response, newCalendar, 201);
});

export const deleteCalendar: RequestHandler = asyncHandler(
  async (request, response) => {
    const { alias } = request.params;
    await removeCalendar(alias);
    successResponse(response, null, 204);
  },
);
