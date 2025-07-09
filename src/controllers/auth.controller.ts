import config from '@config';
import googleOAuthService from '@services/google/googleOAuth.service';
import { asyncHandler } from '@utils/asyncHandler';
import { AppError } from '@utils/errors';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const redirectToGoogle: RequestHandler = (_request, response) => {
  const url = googleOAuthService.generateAuthUrl();
  response.redirect(url);
};

export const handleGoogleCallback: RequestHandler = asyncHandler(
  async (request, response) => {
    const { code } = request.query as { code?: string };
    if (!code) {
      throw new AppError('No code returned from Google', 400);
    }

    const googleUser = await googleOAuthService.getUser(code);

    // Here you would typically create or update the user in your database

    // Placeholder jwt token generation
    const token = jwt.sign(
      {
        userId: googleUser.googleId,
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
