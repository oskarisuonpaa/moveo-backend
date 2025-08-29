import AppError from '../../utils/errors';
import { AppDataSource } from '../../database/data-source';
import Calendar from '../../models/calendar.model';

let calendarIdByAlias: Record<string, string> | null = null;

/**
 * Retrieves a map of calendar aliases to their corresponding calendar IDs.
 * This function initializes the cache if it is not already set.
 * @returns A promise that resolves to a map of calendar aliases to IDs.
 * @module calendarCache.service
 */
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

/**
 * Converts a calendar alias to its corresponding calendar ID.
 * This function fetches the alias map and retrieves the ID.
 * @param alias - The alias of the calendar.
 * @returns A promise that resolves to the calendar ID.
 * @module calendarCache.service
 */
export const calendarAliasToId = async (alias: string): Promise<string> => {
  const aliasMap = await getCalendarAliasMap();
  const calendarId = aliasMap[alias];
  if (!calendarId) {
    throw AppError.notFound(`Calendar with alias ${alias} not found`);
  }
  return calendarId;
};

/**
 * Invalidates the calendar alias cache.
 * This function sets the cache to null, forcing a refresh on the next access.
 * @module calendarCache.service
 */
export const invalidateCalendarAliasCache = () => {
  calendarIdByAlias = null;
};
