import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { extractOrderData } from './parser';
import { addPurchase } from '../shop/purchases.service';
import logger from '../../utils/logger';
import AppError from '../../utils/errors';
import config from '../../config';

const { host, port, email, password } = config.imap;

console.log(config.imap);
export async function connectToImap(): Promise<void> {
  logger.debug(`Connecting to IMAP as ${email}`);

  if (!host || !port || !email || !password) {
    throw AppError.internal('Missing IMAP configuration');
  }

  const client = new ImapFlow({
    host,
    port,
    secure: true,
    auth: {
      user: email,
      pass: password,
    },
  });

  let connected = false;

  try {
    await client.connect();
    connected = true;
    logger.info('Connected to IMAP server');

    const lock = await client.getMailboxLock('INBOX');
    try {
      logger.info(
        'INBOX locked, searching for unseen "Tilausvahvistus" emails...',
      );

      const messages = await client.search({
        seen: false,
        subject: 'Tilausvahvistus',
      });

      if (!messages || messages.length === 0) {
        logger.info('No new matching emails.');
        return;
      }

      for await (const message of client.fetch(messages, { source: true })) {
        if (!message.source) {
          logger.warn('Message has no source content, skipping.');
          continue;
        }

        try {
          const parsed = await simpleParser(message.source);
          const data = extractOrderData(parsed.text || '');

          if (data) {
            await addPurchase(data);
            logger.info(`Purchase saved: ${data.purchaseNumber}`);
          } else {
            logger.warn('Could not extract order data.');
          }
        } catch (err: unknown) {
          logger.error('Failed to process message.');
          logger.debug('Original error:', err);
        }
      }
    } catch (err: unknown) {
      throw AppError.internal('Failed to process mailbox messages', err);
    } finally {
      lock.release();
      logger.debug('Mailbox lock released.');
    }
  } catch (err: unknown) {
    logger.fatal('IMAP connection error.');
    logger.debug('Original error:', err);
    throw AppError.internal('IMAP connection failed', err);
  } finally {
    if (connected) {
      await client.logout();
      logger.info('IMAP connection closed.');
    } else {
      logger.warn('IMAP logout skipped: no active connection.');
    }
  }
}
