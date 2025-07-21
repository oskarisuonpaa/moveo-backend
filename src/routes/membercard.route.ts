import { Router } from 'express';
import {
  getMemberCard,
  updateProfileImage,
} from '../controllers/membercard.controller';

const router = Router();

router.get('/member/:id', getMemberCard);
router.put('/member/:id/image', updateProfileImage);

export default router;
