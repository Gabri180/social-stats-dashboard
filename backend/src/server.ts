// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, testConnection } from './db';
import authRoutes from './routes/authRoutes';
import oauthRoutes from './routes/oauthRoutes';
import statsRoutes from './routes/statsRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:4321',
  credentials: true
}));

app.use(express.json());

// Inicializar base de datos
async function startServer() {
  try {
    await initDatabase();
    testConnection();

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/oauth', oauthRoutes);
    app.use('/api/stats', statsRoutes);

    // Error handling
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
