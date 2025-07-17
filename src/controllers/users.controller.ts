import { RequestHandler } from 'express';

import { getUserById } from '../services/users/users.service';

export const getUser: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).send('User not found.');
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Error fetching user.');
  }
};
