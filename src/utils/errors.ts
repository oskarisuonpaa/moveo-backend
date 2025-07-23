export default class AppError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(message: string, status = 400, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(msg = 'Bad Request', details?: unknown) {
    return new AppError(msg, 400, 'BAD_REQUEST', details);
  }
  static unauthorized(msg = 'Unauthorized', details?: unknown) {
    return new AppError(msg, 401, 'UNAUTHORIZED', details);
  }
  static forbidden(msg = 'Forbidden', details?: unknown) {
    return new AppError(msg, 403, 'FORBIDDEN', details);
  }
  static notFound(msg = 'Not Found', details?: unknown) {
    return new AppError(msg, 404, 'NOT_FOUND', details);
  }
  static conflict(msg = 'Conflict', details?: unknown) {
    return new AppError(msg, 409, 'CONFLICT', details);
  }
  static internal(msg = 'Internal Server Error', details?: unknown) {
    return new AppError(msg, 500, 'INTERNAL_ERROR', details);
  }
}
