/**
 * local server entry file, for local development
 */
import app from './app.js';
import { imageService } from './services/imageService.js';
import { UPLOADS_DIR, GENERATED_DIR } from './config.js';

/**
 * start server with port
 */
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
  
  // Run cleanup on startup
  const cleanup = async () => {
    console.log('[CLEANUP] Starting file cleanup...');
    await imageService.cleanupOldFiles(UPLOADS_DIR);
    await imageService.cleanupOldFiles(GENERATED_DIR);
    console.log('[CLEANUP] Cleanup finished.');
  };

  cleanup();
  
  // Schedule cleanup every 24 hours
  setInterval(cleanup, 24 * 60 * 60 * 1000);
});

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;