import { Request, Response, NextFunction } from 'express';
import { ExampleService } from '../services/example.service';

export const getExample = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await ExampleService.fetchExample();
    res.json({ data });
  } catch (err) {
    next(err);
  }
};
