import { Router } from 'express';
import {
  deleteCalendar,
  getCalendars,
  postCalendar,
} from '@controllers/calendar.controller';
import requireRequestBody from '@middleware/validateRequestBody.middleware';
import validateCalendarAlias from '@middleware/validateCalendarAlias.middleware';

const router = Router();

router.get('/', getCalendars);
router.post('/', requireRequestBody, postCalendar);
router.delete('/:alias', validateCalendarAlias, deleteCalendar);
// router.put('/:alias', updateCalendar);

export default router;
