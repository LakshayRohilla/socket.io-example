import Alarm from '../models/alarm.js';

// Controller: Create a new alarm via REST
export const createAlarm = async (req, res, next) => {
  try {
    // Extract alarm input from request body
    const { plantId, level, message } = req.body || {};
    // Basic validation to ensure required fields exist
    if (!plantId || !level || !message) {
      return res.status(400).json({ error: 'plantId, level, and message are required' });
    }

    // Create and persist a new alarm row in the database
    const alarm = await Alarm.create({ plantId, level, message });

    // Obtain Socket.IO instance from Express app (injected in server.js)
    const io = req.app.get('io');
    // Compute the room name for this plant
    const room = `plant:${alarm.plantId}`;
    // Broadcast the new alarm to all clients in the plant room
    io.to(room).emit('alarm:new', alarm.toJSON());

    // Return the created alarm as JSON
    return res.status(201).json(alarm);
  } catch (err) {
    // Delegate error handling to Express error middleware
    return next(err);
  }
};

// Controller: Acknowledge an existing alarm (id -> acknowledged=true)
export const acknowledgeAlarm = async (req, res, next) => {
  try {
    // Extract the alarm id from URL parameters
    const { id } = req.params;
    // Load the alarm by primary key
    const alarm = await Alarm.findByPk(id);
    // If alarm not found, respond with 404
    if (!alarm) {
      return res.status(404).json({ error: 'Alarm not found' });
    }

    // Mark as acknowledged and persist
    alarm.acknowledged = true;
    await alarm.save();

    // Obtain Socket.IO instance from Express app
    const io = req.app.get('io');
    // Compute the plant room for broadcast
    const room = `plant:${alarm.plantId}`;
    // Broadcast an ack event containing the updated alarm
    io.to(room).emit('alarm:ack', { id: alarm.id, plantId: alarm.plantId, acknowledged: true });

    // Return updated alarm
    return res.json(alarm);
  } catch (err) {
    // Delegate to error middleware
    return next(err);
  }
};

// Controller: List alarms for a given plant (ordered by newest first)
export const listAlarmsByPlant = async (req, res, next) => {
  try {
    // Extract the plantId from URL parameters
    const { plantId } = req.params;
    // Basic validation
    if (!plantId) {
      return res.status(400).json({ error: 'plantId is required' });
    }

    // Query all alarms for the plant, newest first
    const alarms = await Alarm.findAll({
      where: { plantId },
      order: [['createdAt', 'DESC']]
    });

    // Return alarms array
    return res.json(alarms);
  } catch (err) {
    // Delegate to error middleware
    return next(err);
  }
};