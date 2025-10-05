// Import DataTypes and Model from sequelize
import { DataTypes, Model } from 'sequelize';
// Import the configured Sequelize instance
import { sequelize } from '../config/db.js';

// Define an Alarm model extending Sequelize's Model class
class Alarm extends Model {}

// Initialize model fields and options
Alarm.init(
  {
    // Auto-increment integer primary key for simplicity
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // Plant identifier, used for scoping rooms (e.g., "plant-01")
    plantId: { type: DataTypes.STRING, allowNull: false },
    // Alarm level (e.g., "info", "warn", "critical"); keep as string for flexibility
    level: { type: DataTypes.STRING, allowNull: false },
    // Human-readable alarm message
    message: { type: DataTypes.TEXT, allowNull: false },
    // Acknowledgement flag
    acknowledged: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,               // Pass the Sequelize instance
    modelName: 'Alarm',      // Model name
    tableName: 'alarms',     // Explicit table name
    timestamps: true         // createdAt and updatedAt managed automatically
  }
);

// Export the model for use across the app
export default Alarm;