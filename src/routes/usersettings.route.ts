import { Router } from 'express';
import {
  getUserSettings,
  updateUserSettings,
} from '../controllers/usersettings.controller';

const router = Router();

router.get('/settings/:userId', getUserSettings);
router.put('/settings/:userId', updateUserSettings);

export default router;
