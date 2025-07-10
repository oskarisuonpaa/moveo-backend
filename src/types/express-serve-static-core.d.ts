import 'express-serve-static-core';
import { OAuth2Client } from 'google-auth-library';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
    googleClient?: OAuth2Client;
  }
}
