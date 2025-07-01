import express from 'express';
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

app.use((_req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.use(errorHandler);

export default app;
