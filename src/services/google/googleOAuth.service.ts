import config from '../../config';
import AppError from '../../utils/errors';
import { OAuth2Client } from 'google-auth-library';

/**
 * Google OAuth Service
 * This service handles Google OAuth authentication and user information retrieval.
 */
class GoogleOAuthService {
  private client: OAuth2Client;

  constructor() {
    if (!config.google.clientId || !config.google.clientSecret) {
      throw AppError.internal('Google client ID or secret not configured');
    }

    this.client = new OAuth2Client(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri,
    );
  }

  /**
   * Generates the Google OAuth authorization URL.
   * This URL is used to redirect users for authentication.
   */
  generateAuthUrl(): string {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'profile', 'email'],
      prompt: 'consent',
    });
  }

  /**
   * Exchanges the authorization code for user information.
   * This method retrieves the user's Google ID, email, display name, and profile picture.
   * @param code - The authorization code received from Google.
   * @return An object containing user information and tokens.
   * @module googleOAuth.service
   */
  async getUser(code: string) {
    const { tokens } = await this.client.getToken(code);
    this.client.setCredentials(tokens);

    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) throw AppError.forbidden('Invalid Google ID token');

    return {
      googleId: payload.sub,
      email: payload.email,
      displayName: payload.name,
      picture: payload.picture,
      tokens,
    };
  }

  /**
   * Refreshes the access token using the refresh token.
   * This method is used to obtain a new access token when the current one expires.
   */
  async refreshTokens() {
    if (!this.client.credentials.refresh_token) {
      throw AppError.badRequest('No refresh token available');
    }

    const { credentials } = await this.client.refreshAccessToken();
    this.client.setCredentials(credentials);
    return credentials;
  }
}

export default new GoogleOAuthService();
