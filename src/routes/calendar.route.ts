import { Router } from 'express';
import { getCalendarEvents } from '../controllers/calendar.controller';

const router = Router();

router.get('/events', getCalendarEvents);

export default router;
