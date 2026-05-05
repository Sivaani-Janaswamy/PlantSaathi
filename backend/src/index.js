import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { verifyConnection } from './config/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handling
app.use(errorHandler);

// Verify Supabase connection and start server
const startServer = async () => {
  const connected = await verifyConnection();
  if (!connected && process.env.NODE_ENV === 'production') {
    console.error('Failed to connect to Supabase. Exiting.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n🌿 PlantSaathi Backend running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}\n`);
  });
};

startServer();
