import { Router } from 'express';
import {
  deleteCalendar,
  getCalendars,
  postCalendar,
} from '../controllers/calendar.controller';
import { requireRequestBody } from '../middleware/validateRequestBody.middleware';

const router = Router();

router.get('/', getCalendars);
// router.get('/:calendarId', getCalendar);
router.post('/', requireRequestBody, postCalendar);
router.delete('/:calendarId', deleteCalendar);
// router.put('/:calendarId', updateCalendar);

export default router;
