// Import Router from express to define modular routes
import { Router } from 'express';
// Import controller functions for alarms
import { createAlarm, acknowledgeAlarm, listAlarmsByPlant } from '../controllers/alarmController.js';

// Create a new router instance
const router = Router();

// REST endpoint: create a new alarm
router.post('/alarms', createAlarm);

// REST endpoint: acknowledge an existing alarm by id
router.post('/alarms/:id/ack', acknowledgeAlarm);

// REST endpoint: list alarms for a specific plant
router.get('/plants/:plantId/alarms', listAlarmsByPlant);

// Export the router to be mounted in server.js
export default router;