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
  getPendingShopEmailByUserId,
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

const verificationUrl = 'http://localhost:3001/verification';

interface ShopEmailLinkBody {
  userId: string;
  shopEmail: string;
}

/**
 * Controller to handle user registration and email verification.
 * It includes methods to register a user, verify the user, link shop email,
 * and verify shop email.
 */

export const registerVerification: RequestHandler = async (req, res) => {
  try {
    const email = req.query.email as string;
    const token = generateEmailVerificationToken(email);

    // check whether user already exists
    const user = await getUserByEmail(email);
    if (user) {
      if (user.is_verified) {
        res.status(400).send('User already exists and is verified.');
        return;
      } else {
        await updateUserVerificationToken(email, token);
        await sendVerificationEmail(email, token, `${verificationUrl}/verify`);
        res.status(200).send('Verification email re-sent.');
      }
    } else {
      // user does not exist, create user and send verification email
      await createUser(email, token);
      await sendVerificationEmail(email, token, `${verificationUrl}/verify`);
      res.status(200).send('Verification email sent.');
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).send('Error sending verification email.');
  }
};

// user wants to link shop email to their account, send verification email
export const shopEmailToUserLink: RequestHandler<
  object,
  unknown,
  ShopEmailLinkBody
> = async (req, res) => {
  const { userId, shopEmail } = req.body;

  try {
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).send('User not found.');
      return;
    }

    // Check for purchases
    const latestPurchase = await getLatestPurchaseByEmail(shopEmail);
    if (!latestPurchase) {
      res.status(400).send('No purchases found for this shop email.');
      return;
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
    res.status(200).send('Verification email sent to shop email.');
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).send('Error sending verification email.');
  }
};

// user has verified their shop email, link it to their account
export const shopEmailToUserVerification: RequestHandler = async (req, res) => {
  const token = req.query.token as string;

  try {
    const user = await getUserByVerificationToken(token);
    if (!user) {
      res.status(400).send('Invalid or expired token.');
      return;
    }

    const pendingEmail = await getPendingShopEmailByUserId(user.user_id);
    if (!pendingEmail) {
      res.status(400).send('No pending shop email found for this user.');
      return;
    }

    // Get latest purchase and product info
    const latestPurchase = await getLatestPurchaseByEmail(pendingEmail);
    if (!latestPurchase) {
      res.status(400).send('No purchases found for this shop email.');
      return;
    }

    const product = await getProductByCode(latestPurchase.product_code);
    if (!product) {
      res.status(400).send('Product not found for latest purchase.');
      return;
    }

    // Update user info and link shop email
    await updateUserInfoFromPurchase(user.user_id, {
      first_name: latestPurchase.first_name,
      last_name: latestPurchase.last_name,
      product_code: latestPurchase.product_code,
      study_location: latestPurchase.study_location,
      membership_start: product.product_start,
      membership_end: product.product_end,
      product_name: product.product_name,
    });

    await linkShopEmailToUser(user.user_id, pendingEmail);
    await updateUserVerificationToken(user.app_email, null);
    await removePendingShopEmail(user.user_id);

    res.status(200).send('Shop email verified and linked.');
  } catch (error) {
    console.error('Error verifying shop email:', error);
    res.status(500).send('Error verifying shop email.');
  }
};
