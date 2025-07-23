import { RequestHandler } from 'express';

import {
  getAllUsers,
  getUserById,
  createUser,
} from '../services/users/users.service';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responses';
import AppError from '../utils/errors';

export const getUserList: RequestHandler = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  successResponse(res, users);
});

export const getUser: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await getUserById(userId);

  if (!user) {
    throw AppError.notFound('User not found.');
  }
  successResponse(res, user);
});

export const addUser: RequestHandler<
  object,
  unknown,
  {
    email: string;
  }
> = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const token = 'tokenhere';
  // Call the service to add the user
  const newUser = await createUser(email, token);
  successResponse(res, newUser, 201);
});
