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
  frontEndUri: string;
  moveoEmail: string;
  moveoEmailPassword: string;
  allowedEmailDomains: string[];
  imap: {
    host: string;
    port: number;
    email: string;
    password: string;
  };
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
  imap: {
    host: process.env.IMAP_HOST || 'imap.gmail.com',
    port: Number(process.env.IMAP_PORT) || 993,
    email: process.env.IMAP_USER || '',
    password: process.env.IMAP_PASS || '',
  },
  jwtSecret: process.env.JWT_SECRET || 'verysecretkey',
  frontendRedirectUri:
    process.env.FRONTEND_REDIRECT_URI || 'http://localhost:5173',
  frontEndUri: process.env.FRONTEND_URI || 'http://localhost:5173',
  moveoEmail: process.env.MOVEO_EMAIL || '',
  moveoEmailPassword: process.env.MOVEO_EMAIL_PASSWORD || '',
  allowedEmailDomains: (
    process.env.ALLOWED_EMAIL_DOMAINS ||
    'student.lab.fi,student.lut.fi,lab.fi,lut.fi'
  )
    .split(',')
    .map((domain) => domain.trim())
    .filter(Boolean),
};

export default config;
