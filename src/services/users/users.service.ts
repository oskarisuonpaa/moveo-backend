import { AppDataSource } from 'database/data-source';
import UserProfile from '../../models/userProfile.model';
import { UpdateResult } from 'typeorm';
import AppError from '../../utils/errors';
import User from '../../models/user.model';

const UserProfileRepo = AppDataSource.getRepository(UserProfile);
const UserRepo = AppDataSource.getRepository(User);

/**
 * Get a user by their email address
 * @param email - The email address to search for
 * @returns The user profile associated with the email address, or null if not found
 * @module users.service
 */
export const getUserByEmail = (email: string): Promise<UserProfile | null> => {
  return UserProfileRepo.findOne({ where: { app_email: email } });
};

/**
 * Creates a new user profile.
 * @param email - The email address of the user.
 * @param token - The verification token for the user.
 * @returns The created user profile.
 * @module users.service
 */
export const createUser = async (email: string, token: string) => {
  // Check if user already exists
  const existingUser = await UserProfileRepo.findOne({
    where: { app_email: email },
  });
  if (existingUser) {
    throw AppError.conflict('User already exists.');
  }

  // Create new user
  const newUser = UserProfileRepo.create({
    app_email: email,
    verification_token: token,
  });
  return UserProfileRepo.save(newUser);
};

/**
 * Updates the verification token for a user.
 * @param userId - The ID of the user.
 * @param token - The new verification token for the user.
 * @returns The result of the update operation.
 * @module users.service
 */
export const updateUserVerificationToken = (
  userId: string,
  token: string | null,
): Promise<UpdateResult> => {
  if (typeof token === 'undefined') {
    throw AppError.badRequest(
      'Token is required to update verification token.',
    );
  }
  // Update user's verification token
  return UserProfileRepo.update(
    { user_id: userId },
    { verification_token: token },
  );
};

/**
 * Verifies a user by their token.
 * @param token - The verification token for the user.
 * @returns The result of the update operation.
 * @throws {AppError} If the token is invalid or expired.
 * @module users.service
 */
export const verifyUser = async (token: string): Promise<UpdateResult> => {
  if (!token) {
    throw AppError.badRequest('Token is required for verification.');
  }
  // Verify user's token
  const user = await UserProfileRepo.findOne({
    where: { verification_token: token },
  });
  if (!user) {
    throw AppError.notFound('Invalid or expired token.');
  }
  // Update user's verification status
  return UserProfileRepo.update(
    { app_email: user.app_email },
    { is_verified: true, verification_token: null },
  );
};

/**
 * Adds a shop email to a user profile.
 * @param userId - The ID of the user.
 * @param shopEmail - The shop email to link to the user.
 * @returns The result of the update operation.
 * @module users.service
 */
export const linkShopEmailToUser = async (
  userId: string,
  shopEmail: string,
): Promise<UpdateResult> => {
  return UserProfileRepo.update({ user_id: userId }, { shop_email: shopEmail });
};

/**
 * Gets all users in the database.
 * @returns All users in the database
 * @module users.service
 */
export const getAllUsers = (): Promise<UserProfile[]> => {
  return UserProfileRepo.find();
};

/**
 * Gets a user by their profile ID (UserProfile.id).
 * @param userId - The profile ID of the user to find
 * @returns The user profile associated with the user ID, or null if not found
 * @module users.service
 */
export const getUserByProfileId = (
  userId: string,
): Promise<UserProfile | null> => {
  return UserProfileRepo.findOne({ where: { user_id: userId } });
};

/**
 * Gets a user by their user ID (User.id, as opposed to UserProfile ID).
 * @param userId - The user ID of the user to find
 * @returns The user profile associated with the user ID, or null if not found
 * @module users.service
 */
export const getUserByUserId = async (
  userId: string,
): Promise<UserProfile | null> => {
  if (!userId) {
    throw AppError.badRequest('User ID is required to find user.');
  }
  const user = await UserRepo.findOne({ where: { id: userId } });
  if (!user) {
    throw AppError.notFound('User not found for the given user ID.');
  }
  const profileId = user.userProfileId;
  if (!profileId) {
    throw AppError.notFound('User profile not found for the given user ID.');
  }
  return UserProfileRepo.findOne({ where: { user_id: profileId } });
};

// called in verification.controller.ts
/**
 * Updates the user information from a purchase, adding name and product information
 * @param userId - The ID of the user to update.
 * @param purchaseData - The purchase data to update the user with.
 * @returns The result of the update operation.
 * @module users.service
 */
export const updateUserInfoFromPurchase = (
  userId: string,
  purchaseData: {
    first_name: string;
    last_name: string;
    product_code: string;
    study_location: string;
    membership_start: Date | null;
    membership_end: Date;
    product_name: string;
  },
): Promise<UpdateResult> => {
  return UserProfileRepo.update(
    { user_id: userId },
    {
      first_name: purchaseData.first_name,
      last_name: purchaseData.last_name,
      product_code: purchaseData.product_code,
      study_location: purchaseData.study_location,
      membership_start: purchaseData.membership_start
        ? new Date(purchaseData.membership_start)
        : null,
      membership_end: new Date(purchaseData.membership_end),
      product_name: purchaseData.product_name,
    },
  );
};

/**
 * Gets a user by their verification token.
 * @param token - The verification token for the user.
 * @returns The user profile associated with the verification token, or null if not found.
 * @module users.service
 */
export const getUserByVerificationToken = (
  token: string,
): Promise<UserProfile | null> => {
  if (!token) {
    throw AppError.badRequest('Token is required to find user.');
  }
  // Find user by verification token
  return UserProfileRepo.findOne({ where: { verification_token: token } });
};

/**
 * Checks if a user email is already linked to a user other than the specified user.
 * @param email - The email to check.
 * @param userId - The ID of the user to check against.
 * @returns The user profile if found, or null if not found.
 * @module users.service
 */
export const checkUserEmails = async (
  email: string,
  userId: string,
): Promise<UserProfile | null> => {
  if (!email || !userId) {
    throw AppError.badRequest(
      'Email and User ID are required to check user emails.',
    );
  }
  // Check if user exists by email
  const emailFound = await UserProfileRepo.findOne({
    where: [{ app_email: email }, { shop_email: email }],
  });
  if (emailFound && emailFound.user_id !== userId) {
    throw AppError.conflict('Email is already linked to a user.');
  }
  return null;
};
