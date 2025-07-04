import { Router } from 'express';
import {
  deleteCalendar,
  getCalendars,
  postCalendar,
} from '../controllers/calendar.controller';
import { requireRequestBody } from '../middleware/validateRequestBody.middleware';

const router = Router();

router.get('/', getCalendars);
router.post('/', requireRequestBody, postCalendar);
router.delete('/:alias', deleteCalendar);
// router.put('/:alias', updateCalendar);

export default router;
