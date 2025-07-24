import Router from 'express';
import {
  getUser,
  getUserList,
  addUser,
  getCurrentUser,
} from '../controllers/users.controller';
const router = Router();

// TODO: non-admin should not have access to /
router.get('/', getUserList);

// fetch info for current user
router.get('/user', getCurrentUser);

// fetch info for id
router.get('/:userId', getUser);

router.post('/', addUser);

export default router;
