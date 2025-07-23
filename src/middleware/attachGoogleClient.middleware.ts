import { RequestHandler } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { AppDataSource } from 'database/data-source';
import User from '@models/user.model';
import config from '@config';
import AppError from '@utils/errors';

const attachGoogleClient: RequestHandler = async (request, response, next) => {
  if (!request.user?.id) {
    return next(AppError.unauthorized('Not authenticated'));
  }

  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { id: request.user.id } });
  if (!user || !user.refreshToken) {
    return next(AppError.badRequest('No Google credentials stored'));
  }

  if (!config.google.clientId || !config.google.clientSecret) {
    return next(AppError.internal('Google client ID or secret not configured'));
  }

  const client = new OAuth2Client(
    config.google.clientId,
    config.google.clientSecret,
  );
  client.setCredentials({
    access_token: user.accessToken!,
    refresh_token: user.refreshToken,
    expiry_date: user.tokenExpiryDate,
  });
  client.on('tokens', async (tokens) => {
    if (tokens.access_token) user.accessToken = tokens.access_token;
    if (tokens.refresh_token) user.refreshToken = tokens.refresh_token;
    if (tokens.expiry_date) user.tokenExpiryDate = tokens.expiry_date;
    await repo.save(user);
  });

  request.googleClient = client;
  next();
};

export default attachGoogleClient;
