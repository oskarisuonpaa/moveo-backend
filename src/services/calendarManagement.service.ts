import { AppDataSource } from '../database/data-source';
import { Calendar } from '../models/calendar.model';
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
