import { AppDataSource } from '../../database/data-source';
import Calendar from '@models/calendar.model';
import AppError from '@utils/errors';
import { invalidateCalendarSummariesCache } from './calendar.service';
import { invalidateCalendarAliasCache } from './calendarCache.service';
import * as googleCalendar from '@services/google/googleCalendar.service';

/**
 * Creates a new calendar and synchronizes it with the database.
 * @param alias - The alias for the new calendar.
 * @returns The created calendar object.
 * @module calendarManagement.service
 */
export const createAndSyncCalendar = async (alias: string) => {
  const calendarData = {
    summary: alias,
    timeZone: 'Europe/Helsinki',
  };

  const calendar = await googleCalendar.createCalendar(calendarData);

  const repository = AppDataSource.getRepository(Calendar);
  await repository.save({
    calendarId: calendar.id!,
    alias,
  });

  invalidateCalendarAliasCache();
  invalidateCalendarSummariesCache();

  return calendar;
};

/**
 * Removes a calendar by its alias.
 * This function deletes the calendar from Google and removes it from the database.
 * @param alias - The alias of the calendar to be removed.
 * @throws {AppError} If the calendar is not found.
 * @module calendarManagement.service
 */
export const removeCalendar = async (alias: string) => {
  const repository = AppDataSource.getRepository(Calendar);
  const calendar = await repository.findOne({ where: { alias } });

  if (!calendar) {
    throw AppError.notFound('Calendar not found');
  }

  await googleCalendar.removeCalendar(calendar.calendarId);
  await repository.remove(calendar);

  invalidateCalendarAliasCache();
  invalidateCalendarSummariesCache();
};
