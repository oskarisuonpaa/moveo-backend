import { Router } from 'express';
import {
  attendEvent,
  unattendEvent,
} from '@controllers/events.attendees.controller';

const router = Router();

router.post('/:alias/:eventId/attend', attendEvent);
router.delete('/:alias/:eventId/unattend', unattendEvent);

export default router;
