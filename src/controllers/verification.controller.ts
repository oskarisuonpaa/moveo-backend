import { RequestHandler } from 'express';
import {
  getUserByEmail,
  createUser,
  updateUserVerificationToken,
} from '../services/users/users.service';
import { sendVerificationEmail } from '../utils/sendVerificationEmail';
import { generateEmailVerificationToken } from '../utils/token';
import {
  addPendingShopEmail,
  getPendingShopEmailByTokenAndId,
  removePendingShopEmail,
} from '../services/shop/pendingShopEmails.service';
import {
  getUserById,
  getUserByVerificationToken,
  linkShopEmailToUser,
  updateUserInfoFromPurchase,
} from '../services/users/users.service';
import { getLatestPurchaseByEmail } from '../services/shop/purchases.service';
import { getProductByCode } from '../services/shop/products.service';
import AppError from '../utils/errors';
import { asyncHandler } from '@utils/asyncHandler';
import { successResponse } from '@utils/responses';

// TODO: replace with frontend url
const verificationUrl = 'http://localhost:5173';

interface ShopEmailLinkBody {
  userId: string;
  shopEmail: string;
}

/**
 * Controller to handle user registration and email verification.
 * It includes methods to register a user, verify the user, link shop email,
 * and verify shop email.
 */

// registering verification, maybe not needed with Google Oauth
// unless we want to enable logging in without Google after first time
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

// user wants to link shop email to their account, send verification email
export const shopEmailToUserLink: RequestHandler<
  object,
  unknown,
  ShopEmailLinkBody
> = asyncHandler(async (req, res) => {
  const { userId, shopEmail } = req.body;

  const user = await getUserById(userId);
  if (!user) {
    throw AppError.notFound('User not found.');
  }

  // Check for purchases
  const latestPurchase = await getLatestPurchaseByEmail(shopEmail);
  if (!latestPurchase) {
    throw AppError.notFound('No purchases found for this shop email.');
  }

  // Send verification email to shop email
  const token = generateEmailVerificationToken(shopEmail);
  await addPendingShopEmail(userId, shopEmail, token);
  await updateUserVerificationToken(user.app_email, token);
  await sendVerificationEmail(
    shopEmail,
    token,
    `${verificationUrl}/verify-shop-email`,
  );
  successResponse(res, 'Verification email sent to shop email.');
});

// user has verified their shop email, link it to their account
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

    await linkShopEmailToUser(user.user_id, pendingEmail);
    await updateUserVerificationToken(user.app_email, null);
    await removePendingShopEmail(user.user_id);

    successResponse(res, 'Shop email verified and linked.');
  },
);
