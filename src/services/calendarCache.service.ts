import { AppDataSource } from '../database/data-source';
import { Calendar } from '../models/calendar.model';

let calendarIdByAlias: Record<string, string> | null = null;

export const getCalendarAliasMap = async (): Promise<
  Record<string, string>
> => {
  if (calendarIdByAlias) {
    return calendarIdByAlias;
  }

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const repository = AppDataSource.getRepository(Calendar);
  const calendars = await repository.find();
  calendarIdByAlias = calendars.reduce(
    (map, cal) => ({ ...map, [cal.alias]: cal.calendarId }),
    {} as Record<string, string>,
  );
  return calendarIdByAlias;
};

export const invalidateCalendarAliasCache = () => {
  calendarIdByAlias = null;
};
