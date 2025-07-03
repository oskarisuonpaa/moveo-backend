import { Router } from 'express';
import {
  getCalendarEvents,
  postCalendarEvent,
} from '../controllers/events.controller';

const router = Router();

router.get('/:calendarId', getCalendarEvents);
router.post('/:calendarId', postCalendarEvent);

export default router;
