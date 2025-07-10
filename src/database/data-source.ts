import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Calendar from '@models/calendar.model';
import config from '@config';
import logger from '@utils/logger';
import { syncGoogleCalendarsToDb } from '@services/calendar/calendarSync.service';
import User from '@models/user.model';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: config.database,
  entities: [Calendar, User],
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
