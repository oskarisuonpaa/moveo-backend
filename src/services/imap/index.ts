// Email parser bot is its' own module, can be transferred to server.ts

console.log('Script started');

import cron from 'node-cron';
import logger from '@utils/logger';
import { connectToImap } from './imapclient';
import AppError from '@utils/errors';

logger.setLevel('debug');
logger.setPrefix('IMAP');

// schedule to run every 15 minutes between 6 AM and 10 PM (server's time)
cron.schedule('*/15 6-22 * * *', async () => {
  logger.info('Scheduled IMAP check started...');
  try {
    await connectToImap();
    logger.info('Email processing complete.');
  } catch (err: unknown) {
    logger.error('Failed to connect to IMAP');
    logger.debug('Error details:', err);
    throw AppError.internal('IMAP connection failed', err);
  }
});

logger.info('IMAP email checker scheduled.');

// Also run once at startup
void (async () => {
  await connectToImap();
})();
