import { RequestHandler } from 'express';

import {
  getAllUsers,
  getUserByProfileId,
  getUserByUserId,
  createUser,
} from '../services/users/users.service';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responses';
import AppError from '../utils/errors';

/**
 * Controller to handle user-related operations.
 * It includes methods to get user list, get a specific user,
 */

/**
 * gets a list of all users.
 * @param req - The request object.
 */
export const getUserList: RequestHandler = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  successResponse(res, users);
});

/**
 * Gets a user by their profile ID.
 * @param req - The request object containing the user ID in the URL parameters.
 */
export const getUser: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await getUserByProfileId(userId);

  if (!user) {
    throw AppError.notFound('User not found.');
  }
  successResponse(res, user);
});

/**
 * Gets the current authenticated user.
 * @param req - The request object containing the authenticated user (from middleware).
 */
export const getCurrentUser: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw AppError.unauthorized('User not authenticated.');
  }
  const userId = req.user.id;
  const user = await getUserByUserId(userId);

  if (!user) {
    throw AppError.notFound('User not found.');
  }
  successResponse(res, user);
});

/**
 * Adds a new user to the database.
 * @param req - The request object containing user email.
 * @param res - The response object.
 */
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
