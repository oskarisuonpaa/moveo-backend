import config from '@config';
import { AppError } from '@utils/errors';
import { OAuth2Client } from 'google-auth-library';

class GoogleOAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri,
    );
  }

  generateAuthUrl(): string {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'profile', 'email'],
      prompt: 'consent',
    });
  }

  async getUser(code: string) {
    const { tokens } = await this.client.getToken(code);
    this.client.setCredentials(tokens);

    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: config.google.clientId,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new AppError('Invalid Google ID token');

    return {
      googleId: payload.sub,
      email: payload.email,
      displayName: payload.name,
      picture: payload.picture,
      tokens,
    };
  }
}

export default new GoogleOAuthService();
