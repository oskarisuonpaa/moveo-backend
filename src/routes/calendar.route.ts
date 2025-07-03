import { Router } from 'express';
import { getCalendars } from '../controllers/calendar.controller';

const router = Router();

router.get('/', getCalendars);
// router.get('/:calendarId', getCalendar);
// router.post('/', createCalendar);
// router.delete('/:calendarId', deleteCalendar);
// router.put('/:calendarId', updateCalendar);

export default router;
