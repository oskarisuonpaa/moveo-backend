import { OAuth2Client } from 'google-auth-library';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
      googleClient?: OAuth2Client;
    }
  }
}
