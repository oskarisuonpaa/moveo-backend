import { AppDataSource } from 'database/data-source';
import UserProfile from '@models/userProfile.model';
import { UpdateResult } from 'typeorm';
import AppError from '@utils/errors';

const UserProfileRepo = AppDataSource.getRepository(UserProfile);

export const getUserByEmail = (email: string): Promise<UserProfile | null> => {
  return UserProfileRepo.findOne({ where: { app_email: email } });
};

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

export const updateUserVerificationToken = (
  email: string,
  token: string | null,
): Promise<UpdateResult> => {
  if (typeof token === 'undefined') {
    throw AppError.badRequest(
      'Token is required to update verification token.',
    );
  }
  // Update user's verification token
  return UserProfileRepo.update(
    { app_email: email },
    { verification_token: token },
  );
};

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

export const linkShopEmailToUser = async (
  userId: string,
  shopEmail: string,
): Promise<UpdateResult> => {
  return UserProfileRepo.update({ user_id: userId }, { shop_email: shopEmail });
};

export const getAllUsers = (): Promise<UserProfile[]> => {
  return UserProfileRepo.find();
};

export const getUserById = (userId: string): Promise<UserProfile | null> => {
  return UserProfileRepo.findOne({ where: { user_id: userId } });
};

// called in verification.controller.ts
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

export const getUserByVerificationToken = (
  token: string,
): Promise<UserProfile | null> => {
  if (!token) {
    throw AppError.badRequest('Token is required to find user.');
  }
  // Find user by verification token
  return UserProfileRepo.findOne({ where: { verification_token: token } });
};
