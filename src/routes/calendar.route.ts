import { Router } from 'express';
import { getCalendars } from '../controllers/calendar.controller';

const router = Router();

router.get('/', getCalendars);

export default router;
