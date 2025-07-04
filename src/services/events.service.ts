import { calendar_v3 } from 'googleapis';
import { getCalendarAliasMap } from './calendarCache.service';
import { listCalendarEvents } from './googleCalendar.service';

let cachedCalendarEvents: Record<string, calendar_v3.Schema$Event[]> | null =
  null;

export const getCalendarEventsByCalendarAlias = async (
  alias: string,
): Promise<calendar_v3.Schema$Event[]> => {
  if (cachedCalendarEvents && cachedCalendarEvents[alias]) {
    return cachedCalendarEvents[alias];
  }

  const aliasMap = await getCalendarAliasMap();
  const calendarId = aliasMap[alias];

  if (!calendarId) {
    throw new Error(`Calendar with alias ${alias} not found`);
  }

  const events = await listCalendarEvents(calendarId);
  cachedCalendarEvents = {
    ...cachedCalendarEvents,
    [alias]: events,
  };
  return events;
};
