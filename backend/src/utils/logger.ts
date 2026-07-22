// ============================================
// ANSELMO - Logger (Winston)
// ============================================

import winston from 'winston';
import path from 'path';
import config from '../config';

const logsDir = path.resolve(__dirname, '../../logs');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = config.server.isDev ? 'debug' : 'info';

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : '';
    return `${timestamp} ${level}: ${message}${metaStr}`;
  })
);

export const logger = winston.createLogger({
  level,
  levels,
  format,
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
  exitOnError: false,
});

export class LoggerStream {
  write(message: string) {
    logger.http(message.trim());
  }
}

export default logger;
