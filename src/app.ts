import express from 'express';
import { errorHandler } from './middleware/error.middleware';
import exampleRouter from './routes/example.route';

const app = express();
app.use(express.json());

app.use('/api/example', exampleRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use(errorHandler);

export default app;
