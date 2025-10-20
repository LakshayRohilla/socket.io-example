import dotenv from 'dotenv';                  // Load env variables
import express from 'express';                // REST framework
import cors from 'cors';                      // Cross-origin support
import http from 'http';                      // Create raw HTTP server
import { sequelize } from './config/db.js';   // DB connection
import { initSocket } from './socket.js';     // Socket.IO setup
import { initPgListener } from './pgListener.js'; // PG LISTEN bridge
import readingsRouter from './routes/readings.js'; // REST routes

dotenv.config();                              // Populate process.env

const PORT = Number(process.env.PORT || 4000);                 // Port for server
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';    // CORS origin

const app = express();                        // Express app
const server = http.createServer(app);        // HTTP server
const io = initSocket(server, FRONTEND_ORIGIN); // Init Socket.IO with CORS

app.set('io', io);                            // (Optional) make io accessible to routes

app.use(cors({ origin: FRONTEND_ORIGIN }));   // Enable CORS for REST
app.use(express.json());                      // Parse JSON bodies

app.get('/health', (_req, res) => res.json({ status: 'ok' })); // Health probe

app.use('/', readingsRouter);                 // Mount readings routes

app.use((err, _req, res, _next) => {          // Global error handler
  res.status(500).json({ error: 'Internal Server Error', detail: err?.message || 'Unknown error' });
});

const start = async () => {                   // Bootstrap
  try {
    await sequelize.authenticate();           // Verify DB connection
    await sequelize.sync();                   // Sync models (for dev; migrations in prod)
    initPgListener(io, {                      // Start PG listener
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE
    });
    server.listen(PORT, () => {               // Start server + Socket.IO
      console.log(`API + Socket.IO listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err); // Fatal error
    process.exit(1);
  }
};

start();                                      // Run bootstrap

// How it connects:

// Central entrypoint tying together Express, Socket.IO, Sequelize, and the PG listener.
// Exposes REST and realtime pathways simultaneously.