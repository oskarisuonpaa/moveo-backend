import { Router } from 'express';
import {
  getCalendarEvents,
  postCalendarEvent,
} from '../controllers/events.controller';

const router = Router();

router.get('/', getCalendarEvents);
router.post('/', postCalendarEvent);

export default router;
