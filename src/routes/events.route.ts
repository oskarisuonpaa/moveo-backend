import { Router } from 'express';
import {
  getCalendarEvents,
  postCalendarEvent,
} from '../controllers/events.controller';

const router = Router();

router.get('/:calendarId', getCalendarEvents);
// router.get('/:calendarId/:eventId', getCalendarEvent);
router.post('/:calendarId', postCalendarEvent);
// router.delete('/:calendarId/:eventId', deleteCalendarEvent);
// router.put('/:calendarId/:eventId', updateCalendarEvent);

export default router;
