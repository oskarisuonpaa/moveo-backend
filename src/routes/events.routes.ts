import { Router } from 'express';
import {
  getCalendarEvent,
  getCalendarEvents,
  postCalendarEvent,
} from '../controllers/events.controller';
import validateCalendarAlias from '../middleware/validateCalendarAlias.middleware';
import validateEventId from '../middleware/validateEventId.middleware';

const router = Router();

router.get('/:alias', validateCalendarAlias, getCalendarEvents);
router.get(
  '/:alias/:eventId',
  validateCalendarAlias,
  validateEventId,
  getCalendarEvent,
);
router.post('/:alias', validateCalendarAlias, postCalendarEvent);
// router.delete('/:alias/:eventId', deleteCalendarEvent);
// router.put('/:alias/:eventId', updateCalendarEvent);

export default router;
