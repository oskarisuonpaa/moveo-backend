import Router from 'express';
import { getUser } from '../controllers/users.controller';
const router = Router();

router.get('/', (req, res) => {
  res.status(403).send('Forbidden: Not authorized to access this endpoint.');
});

router.get('/:userId', getUser);

export default router;
