import http from 'http';
import app from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(PORT, () => {
  logger.log(`Server is running on port ${PORT}`);
});
