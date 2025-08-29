import { AppDataSource } from 'database/data-source';
import PendingShopEmail from '../../models/pendingShopEmail.model';
import AppError from '../../utils/errors';

const pendingShopEmailRepo = AppDataSource.getRepository(PendingShopEmail);

/**
 * Gets all pending shop emails for a user.
 * @param userId - The ID of the user to get pending shop emails for.
 * @returns An array of pending shop emails associated with the user.
 * @module pendingShopEmails.service
 */
export const getPendingShopEmailByUserId = async (
  userId: string,
): Promise<string> => {
  const email = await pendingShopEmailRepo.findOne({
    where: { userProfileId: userId },
  });
  if (!email) {
    throw AppError.notFound('Pending shop email not found.');
  }
  return email.shop_email;
};

/**
 * Gets a pending shop email that matches the verification token and user ID.
 * @param token - The verification token of the pending shop email.
 * @param userId - The ID of the user to check against.
 * @returns The shop email associated with the token and user ID.
 * @module pendingShopEmails.service
 */
export const getPendingShopEmailByTokenAndId = async (
  token: string,
  userId: string,
): Promise<string> => {
  const email = await pendingShopEmailRepo.findOne({
    where: { verification_token: token, userProfileId: userId },
  });
  if (!email) {
    throw AppError.notFound('Pending shop email not found.');
  }
  return email.shop_email;
};

/**
 * Adds a pending shop email for a user.
 * @param userId - The ID of the user to add the pending shop email for.
 * @param shopEmail - The shop email to be added.
 * @param verificationToken - The verification token for the pending shop email.
 * @returns A promise that resolves when the pending shop email is added.
 * @module pendingShopEmails.service
 */
export const addPendingShopEmail = async (
  userId: string,
  shopEmail: string,
  verificationToken: string,
): Promise<void> => {
  const pendingEmail = pendingShopEmailRepo.create({
    userProfileId: userId,
    shop_email: shopEmail,
    verification_token: verificationToken,
  });
  await pendingShopEmailRepo.save(pendingEmail);
};

/**
 * Removes a pending shop email for a user.
 * @param userId - The ID of the user to remove the pending shop email for.
 * @returns A promise that resolves when the pending shop email is removed.
 * @module pendingShopEmails.service
 */
export const removePendingShopEmail = async (userId: string): Promise<void> => {
  await pendingShopEmailRepo.delete({ userProfileId: userId });
};
