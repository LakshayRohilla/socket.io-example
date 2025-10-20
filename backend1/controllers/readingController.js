import Reading from '../models/Reading.js'; // Sequelize model
import { Op } from 'sequelize';             // Operators for where clauses

// GET /plants/:plantId/readings -> latest readings for a plant
export const listByPlant = async (req, res, next) => {
  try {
    const { plantId } = req.params;                                 // Route param
    const limit = Math.min(Number(req.query.limit || 500), 2000);    // Cap limit
    const rows = await Reading.findAll({
      where: { plant_id: plantId },                                  // Filter plant
      order: [['created_at', 'DESC']],                               // Newest first
      limit                                                           // Pagination
    });
    res.json(rows);                                                   // Respond JSON
  } catch (e) { next(e); }                                            // Error -> middleware
};

// GET /plants/:plantId/readings/since?since=ISO
export const listByPlantSince = async (req, res, next) => {
  try {
    const { plantId } = req.params;                                  // Route param
    const { since } = req.query;                                     // ISO timestamp
    const rows = await Reading.findAll({
      where: {
        plant_id: plantId,
        created_at: { [Op.gt]: new Date(since) }                      // Newer-than filter
      },
      order: [['created_at', 'DESC']]
    });
    res.json(rows);
  } catch (e) { next(e); }
};

// How it connects:

// Called by routes/readings.js; used by frontend RTK Query to hydrate initial state and backfill on reconnect.
// Uses Reading model; independent of Socket.IO.