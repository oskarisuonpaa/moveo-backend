import { Router } from 'express';
import {
  getCalendarEvent,
  getCalendarEvents,
} from '../controllers/events.controller';
const router = Router();

router.get('/:alias', getCalendarEvents);
router.get('/:alias/:eventId', getCalendarEvent);
// router.post('/:alias', postCalendarEvent);
// router.delete('/:alias/:eventId', deleteCalendarEvent);
// router.put('/:alias/:eventId', updateCalendarEvent);

export default router;
