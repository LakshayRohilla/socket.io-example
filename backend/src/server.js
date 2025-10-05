import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { sequelize } from './config/db.js';
import { initSocket } from './socket.js';
import alarmsRouter from './routes/alarms.js';

dotenv.config();

const PORT = Number(process.env.PORT || 4000);                    
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';       

const app = express();
// Create an HTTP server to attach Socket.IO
const server = http.createServer(app);
// Initialize Socket.IO and capture the io instance
const io = initSocket(server, FRONTEND_ORIGIN);

// Make io available to route handlers/controllers via app
app.set('io', io);

// Enable CORS for REST endpoints
app.use(cors({ origin: FRONTEND_ORIGIN }));
// Enable JSON body parsing for incoming requests
app.use(express.json());

// Simple health check endpoint for readiness probes
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Mount alarms-related routes at root
app.use('/', alarmsRouter);

// Global error handler to format errors
app.use((err, _req, res, _next) => {
  // Log error in server logs (optional)
  // console.error(err);
  // Respond with generic error details
  res.status(500).json({ error: 'Internal Server Error', detail: err?.message || 'Unknown error' });
});

// Bootstrap function to start DB and HTTP server
const start = async () => {
  try {
    // Verify DB connectivity
    await sequelize.authenticate();
    // Auto-sync models with the database (for demo; consider migrations in production)
    await sequelize.sync();
    // Start listening for HTTP and WebSocket connections
    server.listen(PORT, () => {
      // Log a startup message
      console.log(`API + Socket.IO listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    // Exit process if startup fails
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

// Invoke the bootstrap
start();