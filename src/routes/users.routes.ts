import Router from 'express';
import { getUser, getUserList, addUser } from '../controllers/users.controller';
const router = Router();

// TODO: non-admin should not have access to /
router.get('/', getUserList);

router.get('/:userId', getUser);

router.post('/', addUser);

export default router;
