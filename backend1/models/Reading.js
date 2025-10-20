import { DataTypes, Model } from 'sequelize'; // Types + base Model class
import { sequelize } from '../config/db.js';  // Shared Sequelize instance

class Reading extends Model {} // Model class placeholder

Reading.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true }, // PK
    plant_id: { type: DataTypes.STRING, allowNull: false },                // routing key
    value: { type: DataTypes.DECIMAL(18, 6), allowNull: false },           // measurement
    status: { type: DataTypes.STRING }                                      // optional state
  },
  {
    sequelize,               // DB connection
    modelName: 'Reading',    // Internal name
    tableName: 'readings',   // DB table name
    timestamps: true,        // created_at and updated_at
    underscored: true        // snake_case columns
  }
);

export default Reading; // Used in controllers and optional fetch in pgListener

// How it connects:

// Queried by readingController.js for initial/backfill REST endpoints.
// Optional: fetched in pgListener.js if NOTIFY payload only includes id.