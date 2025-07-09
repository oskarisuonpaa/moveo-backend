import http from 'http';
import app from './app';
import { logger } from './utils/logger';
import { initializeDataSource } from './database/data-source';

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    await initializeDataSource();

    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    server.on('error', (error) => {
      logger.fatal(
        'Server encountered an error:',
        error instanceof Error ? error.message : error,
      );
    });
  } catch (error) {
    logger.fatal(
      'Failed to start server:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};

void startServer();
