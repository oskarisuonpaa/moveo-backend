import { RequestHandler } from 'express';
import { ParsedQs } from 'qs';

export const asyncHandler =
  <
    P = Record<string, string>,
    ResBody = unknown,
    ReqBody = Record<string, unknown>,
    ReqQuery = ParsedQs,
  >(
    fn: RequestHandler<P, ResBody, ReqBody, ReqQuery>,
  ): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
