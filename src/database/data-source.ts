import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Calendar } from '../models/calendar.model';
import config from '../config';
import { logger } from '../utils/logger';
import { syncGoogleCalendarsToDb } from '../services/calendarSync.service';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: config.database,
  entities: [Calendar],
  synchronize: true,
  logging: false,
});

export const initializeDataSource = async () => {
  if (AppDataSource.isInitialized) {
    logger.warn('Data Source is already initialized.');
    return;
  }

  try {
    await AppDataSource.initialize();
    logger.info('Data Source has been initialized successfully.');
    await syncGoogleCalendarsToDb();
    logger.info('Google Calendars synchronized to the database successfully.');
  } catch (error) {
    logger.error('Error during Data Source initialization:', error);
    throw error;
  }
};
