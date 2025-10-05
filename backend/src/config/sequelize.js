// Import Sequelize constructor from sequelize package
import { Sequelize } from 'sequelize';
// Import dotenv to load environment variables from .env
import dotenv from 'dotenv';

// Initialize dotenv to read .env file into process.env
dotenv.config();

// Create and export a configured Sequelize instance for PostgreSQL
export const sequelize = new Sequelize(
  process.env.PG_DATABASE || 'alarms',        // Database name
  process.env.PG_USER || 'postgres',          // Database user
  process.env.PG_PASSWORD || 'postgres',      // Database password
  {
    host: process.env.PG_HOST || 'localhost', // Database host
    port: Number(process.env.PG_PORT || 5432),// Database port
    dialect: 'postgres',                      // Use PostgreSQL dialect
    logging: false                            // Disable SQL logging for cleanliness
  }
);