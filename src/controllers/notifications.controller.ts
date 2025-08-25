import { RequestHandler } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { successResponse } from '@utils/responses';
import { createSubscription } from '@services/subscriptions/subscriptions.service';

export const getNotifications: RequestHandler = asyncHandler(
  async (req, res) => {
    // Dummy notifications data
    const notifications = [
      { id: 1, title: 'Welcome', message: 'Thanks for joining our platform!' },
      { id: 2, title: 'Update', message: 'Your profile has been updated.' },
    ];
    successResponse(res, notifications);
  },
);

export const newSubscription: RequestHandler = asyncHandler(
  async (req, res) => {
    //  save the subscription object to database
    await createSubscription(req.body);
    console.log('Received subscription:', req.body);
    res.status(201).json({ message: 'Subscription received' });
  },
);
