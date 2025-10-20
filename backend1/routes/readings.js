import { Router } from 'express';                  // Router factory
import { listByPlant, listByPlantSince } from '../controllers/readingController.js';

const router = Router();                           // New router instance
router.get('/plants/:plantId/readings', listByPlant);       // Initial fetch
router.get('/plants/:plantId/readings/since', listByPlantSince); // Backfill fetch
export default router;                             // Mounted in server.js

// How it connects:

// Mounted in server.js under app.use('/', router).
// Consumed by frontend RTK Query endpoints.