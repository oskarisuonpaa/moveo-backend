import { calendar_v3 } from 'googleapis';

const sanitizeGoogleCalendarEventFormat = (event: calendar_v3.Schema$Event) => {
  const sanitizedEvent = {
    id: event.id,
    title: event.summary,
    description: event.description,
    start: event.start?.dateTime,
    end: event.end?.dateTime,
    location: event.location || 'No Location',
    maxAttendees: event.extendedProperties?.private?.maxAttendees || 'No limit',
    attendees:
      event.attendees?.map((attendee) => ({
        email: attendee.email,
        responseStatus: attendee.responseStatus,
      })) || [],
  };

  return sanitizedEvent;
};

export default sanitizeGoogleCalendarEventFormat;
