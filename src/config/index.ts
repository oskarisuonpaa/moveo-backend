import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  serviceAccount: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceAccount:
    process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json',
};

export default config;
