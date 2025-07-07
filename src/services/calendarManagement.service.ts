import { AppDataSource } from '../database/data-source';
import { Calendar } from '../models/calendar.model';
import { AppError } from '../utils/errors';
import { invalidateCalendarSummariesCache } from './calendar.service';
import { invalidateCalendarAliasCache } from './calendarCache.service';
import * as googleCalendar from './googleCalendar.service';

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

export const removeCalendar = async (alias: string) => {
  const repository = AppDataSource.getRepository(Calendar);
  const calendar = await repository.findOne({ where: { alias } });

  if (!calendar) {
    throw new AppError('Calendar not found');
  }

  await googleCalendar.removeCalendar(calendar.calendarId);
  await repository.remove(calendar);

  invalidateCalendarAliasCache();
  invalidateCalendarSummariesCache();
};
