import * as googleCalendar from './googleCalendar.service';
import { AppDataSource } from '../database/data-source';
import { Calendar } from '../models/calendar.model';
import { invalidateCalendarAliasCache } from './calendarCache.service';
import { invalidateCalendarSummariesCache } from './calendar.service';

export const syncGoogleCalendarsToDb = async () => {
  const items = await googleCalendar.getCalendarList();
  const repo = AppDataSource.getRepository(Calendar);

  for (const item of items) {
    await repo.upsert({ alias: item.summary!, calendarId: item.id! }, [
      'alias',
    ]);
  }

  invalidateCalendarAliasCache();
  invalidateCalendarSummariesCache();
};
