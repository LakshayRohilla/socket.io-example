import { Sequelize } from 'sequelize'; // ORM core
import dotenv from 'dotenv'; // .env loader

dotenv.config(); // Populate process.env for use below

export const sequelize = new Sequelize(
  process.env.PG_DATABASE || 'alarms',        // DB name from env
  process.env.PG_USER || 'postgres',          // DB user
  process.env.PG_PASSWORD || 'postgres',      // DB password
  {
    host: process.env.PG_HOST || 'localhost', // DB host
    port: Number(process.env.PG_PORT || 5432),// DB port
    dialect: 'postgres',                      // Use Postgres driver
    logging: false                            // Disable SQL logs (toggle for debug)
  }
);

// How it connects:

// Exported sequelize instance is used by models (Reading.js) and initialized in server.js (authenticate/sync).