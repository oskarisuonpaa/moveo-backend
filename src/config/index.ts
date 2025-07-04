import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  serviceAccount: string;
  database: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: process.env.DATABASE_URL || ':memory:',
  serviceAccount:
    process.env.GOOGLE_APPLICATION_CREDENTIALS || '../../service-account.json',
};

export default config;
