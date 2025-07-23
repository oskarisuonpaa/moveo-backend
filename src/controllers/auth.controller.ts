import config from '@config';
import googleOAuthService from '@services/google/googleOAuth.service';
import { asyncHandler } from '@utils/asyncHandler';
import AppError from '@utils/errors';
import { AppDataSource } from 'database/data-source';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import UserProfile from '@models/userProfile.model';

export const redirectToGoogle: RequestHandler = (_request, response) => {
  const url = googleOAuthService.generateAuthUrl();
  response.redirect(url);
};

export const handleGoogleCallback: RequestHandler = asyncHandler(
  async (request, response) => {
    const { code } = request.query as { code?: string };
    if (!code) {
      throw AppError.badRequest('No code returned from Google');
    }

    const googleUser = await googleOAuthService.getUser(code);

    const userProfileRepo = AppDataSource.getRepository(UserProfile);
    let userProfile: UserProfile | null = await userProfileRepo.findOne({
      where: { app_email: googleUser.email },
    });
    if (!userProfile) {
      userProfile = userProfileRepo.create({ app_email: googleUser.email });
      await userProfileRepo.save(userProfile);
    }

    const repository = AppDataSource.getRepository('User');
    let user = await repository.findOne({
      where: { googleId: googleUser.googleId },
    });

    if (!user) {
      user = repository.create({
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: googleUser.displayName,
        accessToken: googleUser.tokens.access_token,
        refreshToken: googleUser.tokens.refresh_token,
        tokenExpiryDate: googleUser.tokens.expiry_date,
        userProfileId: userProfile.user_id,
      });
      await repository.save(user);
    }

    const token = jwt.sign(
      {
        userId: user.id as string,
        email: user.email as string,
      },
      config.jwtSecret,
      { expiresIn: '1h' },
    );

    response.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
    });
    response.redirect(config.frontendRedirectUri);
  },
);
