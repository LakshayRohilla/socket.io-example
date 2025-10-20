import { Client } from 'pg';        // Low-level Postgres driver
import Reading from './models/Reading.js'; // Optional for full-row fetch

export function initPgListener(io, pgConfig, channel = 'readings_channel') {
  const client = new Client(pgConfig);     // Dedicated connection for LISTEN

  const connect = async () => {
    await client.connect();                // Open connection
    await client.query(`LISTEN ${channel}`); // Subscribe to NOTIFY channel
  };

  client.on('notification', async (msg) => {
    try {
      const data = JSON.parse(msg.payload);          // Parse JSON from NOTIFY
      const room = `plant:${data.plantId}`;          // Compute Socket.IO room

      // Option A (light payload): emit as-is
      if (data.type === 'insert') io.to(room).emit('reading:new', data);
      else if (data.type === 'update') io.to(room).emit('reading:update', data);
      else io.to(room).emit('reading:event', data);

      // Option B (minimal payload): fetch full row (uncomment if needed)
      // const full = await Reading.findByPk(data.id);
      // if (full) io.to(room).emit('reading:new', full.toJSON());
    } catch (e) {
      console.error('PG notification parse error', e); // Log and continue
    }
  });

  client.on('error', (err) => console.error('PG listener error', err)); // Recover in prod
  (async () => { try { await connect(); } catch (e) { console.error('PG connect error', e); } })();

  return client; // For lifecycle mgmt if needed
}

// How it connects:

// server.js calls initPgListener(io, ...).
// Receives NOTIFY payloads from the triggers defined in the migration.
// Emits to rooms managed by socket.js based on plantId.
// Frontend listeners update RTK Query cache in real time.