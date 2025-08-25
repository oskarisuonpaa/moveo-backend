import Router from 'express';
import { getNotifications } from '../controllers/notifications.controller';

const router = Router();
router.get('/', getNotifications);

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Notification created' });
});

router.post('/subscribe', (req, res) => {
  // Here you would normally save the subscription object to your database
  console.log('Received subscription:', req.body);
  res.status(201).json({ message: 'Subscription received' });
});