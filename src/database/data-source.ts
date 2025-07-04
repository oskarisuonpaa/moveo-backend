import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Calendar } from '../models/calendar.model';
import config from '../config';
import { logger } from '../utils/logger';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: config.database,
  entities: [Calendar],
  synchronize: true,
  logging: config.nodeEnv === 'development',
});

export const initializeDataSource = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Data Source has been initialized successfully.');
  } catch (error) {
    logger.error('Error during Data Source initialization:', error);
    throw error;
  }
};
