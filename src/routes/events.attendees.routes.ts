import { Router } from 'express';
import {
  attendEvent,
  unattendEvent,
} from '../controllers/events.attendees.controller';

const router = Router();

router.post('/:alias/:eventId', attendEvent);
router.delete('/attendees/:alias/:eventId/:email', unattendEvent);

export default router;
