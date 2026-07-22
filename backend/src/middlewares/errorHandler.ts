// ============================================
// ANSELMO - Global Error Handler Middleware
// ============================================

import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import config from '../config';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        errors: err.errors,
      },
    });
    return;
  }

  if (err instanceof AppError) {
    logger.warn(`Operational error: ${err.message}`, {
      code: err.code,
      statusCode: err.statusCode,
    });

    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Erro desconhecido (não operacional)
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  if (config.server.isDev) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: err.message,
        stack: err.stack,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
