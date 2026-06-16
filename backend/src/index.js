import 'dotenv/config';
import app from './app.js';
import logger from './utils/logger.js';
import prisma from './utils/prismaClient.js';

const PORT = parseInt(process.env.PORT) || 3001;

async function main() {
  // Test database connection
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (err) {
    logger.error('❌ Database connection failed', { error: err.message });
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    logger.info(`🚀 EcoGuide AI API running on http://localhost:${PORT}`, {
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
    });
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Server closed. Database disconnected.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main();
