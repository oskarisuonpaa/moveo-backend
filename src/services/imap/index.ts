// Email parser bot is its' own module, can be transferred to server.ts

console.log('Script started');

import logger from '@utils/logger';
import { connectToImap } from './imapclient';
import AppError from '@utils/errors';

logger.setLevel('debug');
logger.setPrefix('IMAP');

void (async () => {
  logger.info('Connecting to email inbox...');

  try {
    await connectToImap();
    logger.info('Email processing complete.');
  } catch (err: unknown) {
    logger.error('Failed to connect to IMAP');
    logger.debug('Error details:', err);
    throw AppError.internal('IMAP connection failed', err);
  }
})();
