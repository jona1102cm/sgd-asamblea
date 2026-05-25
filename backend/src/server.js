const app = require('./app');
const logger = require('./utils/logger');

// Get port from environment or use default
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const server = app.listen(PORT, () => {
  logger.info(`
    ╔════════════════════════════════════════════════════════════╗
    ║  Sistema de Gestión de Documentos - Asamblea Nacional      ║
    ╠════════════════════════════════════════════════════════════╣
    ║  Servidor iniciado correctamente                           ║
    ║  Ambiente: ${NODE_ENV.toUpperCase().padEnd(47)}║
    ║  Puerto: ${PORT.toString().padEnd(52)}║
    ║  URL: http://localhost:${PORT.toString().padEnd(44)}║
    ╚════════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Handle SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = server;
