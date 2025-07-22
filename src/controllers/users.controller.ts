import { RequestHandler } from 'express';

import {
  getAllUsers,
  getUserById,
  createUser,
} from '../services/users/users.service';

export const getUserList: RequestHandler = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching user list:', error);
    res.status(500).send('Error fetching user list.');
  }
};

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

export const addUser: RequestHandler<
  object,
  unknown,
  {
    email: string;
  }
> = async (req, res) => {
  try {
    const { email } = req.body;
    const token = 'tokenhere';
    // Call the service to add the user
    const newUser = await createUser(email, token);
    res.status(201).json(newUser);
  } catch (error: unknown) {
    console.error('Error adding user:', error);
    res.status(500).send((error as Error).message || 'Error adding user.');
  }
};
