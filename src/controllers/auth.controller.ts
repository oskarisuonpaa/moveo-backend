import config from '@config';
import googleOAuthService from '@services/google/googleOAuth.service';
import { asyncHandler } from '@utils/asyncHandler';
import { badRequest } from '@utils/errors';
import { AppDataSource } from 'database/data-source';
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
      badRequest('No code returned from Google');
    }

    const googleUser = await googleOAuthService.getUser(code as string);

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
        expiryDate: googleUser.tokens.expiry_date,
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
