import { Router } from 'express';
import {
  getCalendarEvents,
  postCalendarEvent,
} from '../controllers/events.controller';
import { requireCalendarId } from '../middleware/validateCalendarId.middleware';

const router = Router();

router.get('/:calendarId', requireCalendarId, getCalendarEvents);
// router.get('/:calendarId/:eventId', getCalendarEvent);
router.post('/:calendarId', requireCalendarId, postCalendarEvent);
// router.delete('/:calendarId/:eventId', deleteCalendarEvent);
// router.put('/:calendarId/:eventId', updateCalendarEvent);

export default router;
