import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Calendar from '@models/calendar.model';
import config from '@config';
import logger from '@utils/logger';
import { syncGoogleCalendarsToDb } from '@services/calendar/calendarSync.service';
import User from '@models/user.model';
import UserProfile from '@models/userProfile.model';
import Product from '@models/product.model';
import PendingShopEmail from '@models/pendingShopEmail.model';
import Purchase from '@models/purchase.model';
import { seedProducts, seedPurchase } from './seedData';
import AppError from '@utils/errors';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: config.database,
  entities: [Calendar, User, UserProfile, Product, PendingShopEmail, Purchase],
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
    await seedProducts();
    logger.info('Products seeded successfully.');
    await seedPurchase();
    logger.info('Purchase seeded successfully.');
  } catch (error) {
    throw AppError.internal('Error during Data Source initialization:', error);
  }
};
