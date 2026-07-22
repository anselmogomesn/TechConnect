// ============================================
// ANSELMO - Server Entry Point
// ============================================

import app from './app';
import config from './config';
import { logger } from './utils/logger';
import prisma from './config/prisma';
import { createServer } from 'http';
import { initializeSocket } from './socket';

async function bootstrap() {
  try {
    // Verificar conexão com banco
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Criar servidor HTTP
    const httpServer = createServer(app);

    // Inicializar Socket.IO
    initializeSocket(httpServer);

    // Iniciar servidor
    httpServer.listen(config.server.port, config.server.host, () => {
      logger.info(`
 ╔══════════════════════════════════════════════╗
 ║         TechConnect - Rede Social             ║
 ║                                              ║
 ║  Server:  http://${config.server.host}:${config.server.port}          ║
 ║  Health:  http://${config.server.host}:${config.server.port}/api/health ║
 ║  Env:     ${config.server.nodeEnv.padEnd(36)}║
 ╚══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Unhandled rejections
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

bootstrap();
