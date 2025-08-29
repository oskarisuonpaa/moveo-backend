import { RequestHandler } from 'express';
import {
  getUserByEmail,
  createUser,
  updateUserVerificationToken,
  checkUserEmails,
} from '../services/users/users.service';
import { sendVerificationEmail } from '../utils/sendVerificationEmail';
import { generateEmailVerificationToken } from '../utils/token';
import {
  addPendingShopEmail,
  getPendingShopEmailByTokenAndId,
  removePendingShopEmail,
} from '../services/shop/pendingShopEmails.service';
import {
  getUserByUserId,
  getUserByVerificationToken,
  linkShopEmailToUser,
  updateUserInfoFromPurchase,
} from '../services/users/users.service';
import { addPurchaseUserId } from '@services/shop/purchases.service';
import {
  getLatestPurchaseByEmail,
  getPurchasesByEmail,
} from '../services/shop/purchases.service';
import { getProductByCode } from '../services/shop/products.service';
import AppError from '../utils/errors';
import { asyncHandler } from '@utils/asyncHandler';
import { successResponse } from '@utils/responses';
import config from '@config';
import { AppDataSource } from 'database/data-source';
import PendingShopEmail from '@models/pendingShopEmail.model';

const verificationUrl = config.frontEndUri;
const PendingShopEmailRepo = AppDataSource.getRepository(PendingShopEmail);

interface ShopEmailLinkBody {
  shopEmail: string;
}

/**
 * Controller to handle user registration and email verification.
 * It includes methods to register a user, verify the user, link shop email,
 * and verify shop email.
 */

// registering verification, maybe not needed with Google Oauth
// unless we want to enable logging in without Google after first time
/**
 * Registers a user and sends a verification email.
 * @param req - The request object containing user email.
 */
export const registerVerification: RequestHandler = asyncHandler(
  async (req, res) => {
    const email = req.query.email as string;
    const token = generateEmailVerificationToken(email);

    // check whether user already exists
    const user = await getUserByEmail(email);
    if (user) {
      if (user.is_verified) {
        throw AppError.badRequest('User already exists and is verified.');
      } else {
        await updateUserVerificationToken(email, token);
        await sendVerificationEmail(email, token, `${verificationUrl}/verify`);
        successResponse(res, 'Verification email re-sent.');
      }
    } else {
      // user does not exist, create user and send verification email
      await createUser(email, token);
      await sendVerificationEmail(email, token, `${verificationUrl}/verify`);
      successResponse(res, 'Verification email sent.');
    }
  },
);

/**
 * Adds a pending shop email for a user and sends a verification email.
 * @param req - The request object containing user ID and shop email.
 * @param res - The response object.
 */
export const shopEmailToUserLink: RequestHandler<
  object,
  unknown,
  ShopEmailLinkBody
> = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw AppError.unauthorized('User not authenticated.');
  }
  const userId = req.user.id;
  const { shopEmail } = req.body;

  const user = await getUserByUserId(userId);
  if (!user) {
    throw AppError.notFound('User not found.');
  }

  // Check for purchases
  const latestPurchase = await getLatestPurchaseByEmail(shopEmail);
  if (!latestPurchase) {
    throw AppError.notFound('No purchases found for this shop email.');
  }

  // check that the email is not already linked to a user
  const purchases = await getPurchasesByEmail(shopEmail);
  const conflictingPurchase = purchases.find(
    (p) => p.userProfileId && p.userProfileId !== user.user_id,
  );
  if (conflictingPurchase) {
    throw AppError.conflict(
      'This shop email is already linked to another user.',
    );
  }

  // Send verification email to shop email
  const token = generateEmailVerificationToken(shopEmail);
  const emailExists = await checkUserEmails(shopEmail, user.user_id);
  if (emailExists) {
    throw AppError.conflict('Shop email is already linked to a user.');
  }
  const pendingEmail = await PendingShopEmailRepo.findOne({
    where: { shop_email: shopEmail },
  });
  if (pendingEmail) {
    throw AppError.conflict('Shop email is already being linked to a user.');
  }
  await addPendingShopEmail(user.user_id, shopEmail, token);
  await updateUserVerificationToken(user.user_id, token);
  await sendVerificationEmail(
    shopEmail,
    token,
    `${verificationUrl}/verify-email`,
  );
  successResponse(res, 'Verification email sent to shop email.');
});

/**
 * Verifies the pending shop email and links it to the user account.
 * @param req - The request object containing the verification token.
 * @param res - The response object.
 */
export const shopEmailToUserVerification: RequestHandler = asyncHandler(
  async (req, res) => {
    const token = req.query.token as string;
    const user = await getUserByVerificationToken(token);
    if (!user) {
      throw AppError.badRequest('Invalid or expired token.');
    }

    const pendingEmail = await getPendingShopEmailByTokenAndId(
      token,
      user.user_id,
    );
    if (!pendingEmail) {
      throw AppError.badRequest('No pending shop email found for this user.');
    }

    // Get latest purchase and product info
    const latestPurchase = await getLatestPurchaseByEmail(pendingEmail);
    if (!latestPurchase) {
      throw AppError.notFound('No purchases found for this shop email.');
    }

    const product = await getProductByCode(latestPurchase.product_code);
    if (!product) {
      throw AppError.notFound('Product not found for latest purchase.');
    }

    // Update user info and link shop email
    await updateUserInfoFromPurchase(user.user_id, {
      first_name: latestPurchase.first_name,
      last_name: latestPurchase.last_name,
      product_code: latestPurchase.product_code,
      study_location: latestPurchase.study_location,
      membership_start: latestPurchase.product_start_date,
      membership_end: latestPurchase.product_end_date,
      product_name: product.product_name,
    });

    // Link also past purchases with the same email to the user
    const purchases = await getPurchasesByEmail(pendingEmail);
    for (const purchase of purchases) {
      await addPurchaseUserId(purchase.purchase_id, user.user_id);
    }
    await linkShopEmailToUser(user.user_id, pendingEmail);
    await updateUserVerificationToken(user.user_id, null);
    await removePendingShopEmail(user.user_id);

    successResponse(res, 'Shop email verified and linked.');
  },
);
