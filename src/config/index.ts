import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  serviceAccount: string;
  database: string;
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  jwtSecret: string;
  frontendRedirectUri: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: process.env.DATABASE_URL || ':memory:',
  serviceAccount:
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    '../../../service-account.json',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      'http://localhost:3000/auth/google/callback',
  },
  jwtSecret: process.env.JWT_SECRET || 'verysecretkey',
  frontendRedirectUri:
    process.env.FRONTEND_REDIRECT_URI || 'http://localhost:5173',
};

export default config;
