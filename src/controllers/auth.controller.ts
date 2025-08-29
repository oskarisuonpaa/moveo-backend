import config from '../config';
import googleOAuthService from '../services/google/googleOAuth.service';
import { asyncHandler } from '../utils/asyncHandler';
import AppError from '../utils/errors';
import { AppDataSource } from 'database/data-source';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import UserProfile from '../models/userProfile.model';
import User from '../models/user.model';

/**
 * Redirects the user to the Google OAuth consent screen.
 * @param _request
 * @param response
 */
export const redirectToGoogle: RequestHandler = (_request, response) => {
  const url = googleOAuthService.generateAuthUrl();
  response.redirect(url);
};

/**
 * Handles the callback from Google OAuth after user consent.
 * Retrieves the user information and creates or updates the user in the database.
 * @param request
 * @param response
 */
export const handleGoogleCallback: RequestHandler = asyncHandler(
  async (request, response) => {
    const { code } = request.query as { code?: string };
    if (!code) {
      throw AppError.badRequest('No code returned from Google');
    }

    // Exchange the authorization code for user information
    const googleUser = await googleOAuthService.getUser(code);

    // check the email domain
    const allowedDomains = config.allowedEmailDomains || [];
    if (
      !allowedDomains.some((domain) => googleUser.email!.endsWith(`@${domain}`))
    ) {
      throw AppError.forbidden(
        'You must sign in with your LAB or LUT credentials.',
      );
    }

    // Check if the user already exists in the database
    const repository = AppDataSource.getRepository(User);
    const userProfileRepo = AppDataSource.getRepository(UserProfile);
    let user = await repository.findOne({
      where: { googleId: googleUser.googleId },
    });

    // If the user does not exist, create a new user
    if (!user) {
      let userProfile = await userProfileRepo.findOne({
        where: { app_email: googleUser.email },
      });
      // if user profile does not exist, create a new one
      if (!userProfile) {
        userProfile = userProfileRepo.create({ app_email: googleUser.email });
        await userProfileRepo.save(userProfile);
      }
      // create new user
      user = repository.create({
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: googleUser.displayName,
        accessToken: googleUser.tokens.access_token,
        refreshToken: googleUser.tokens.refresh_token,
        tokenExpiryDate: googleUser.tokens.expiry_date,
        userProfileId: userProfile.user_id, // link user to user profile
      });
      await repository.save(user);
    } else {
      // user exists, make sure userProfile exists and is linked
      let userProfile = await userProfileRepo.findOne({
        where: { app_email: googleUser.email },
      });
      if (!userProfile) {
        userProfile = userProfileRepo.create({ app_email: googleUser.email });
        await userProfileRepo.save(userProfile);
      }
      if (!user.userProfileId) {
        user.userProfileId = userProfile.user_id;
        await repository.save(user);
      }
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      config.jwtSecret,
      { expiresIn: '1h' },
    );

    // Set the token in a cookie and redirect to the frontend
    response.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
    });
    response.redirect(config.frontendRedirectUri);
  },
);
