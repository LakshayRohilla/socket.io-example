export async function up(queryInterface) {
  const sql = `
    CREATE TABLE IF NOT EXISTS readings (
      id BIGSERIAL PRIMARY KEY,
      plant_id TEXT NOT NULL,
      value NUMERIC NOT NULL,
      status TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_readings_plant_created ON readings (plant_id, created_at DESC);

    CREATE OR REPLACE FUNCTION notify_readings_insert() RETURNS trigger AS $$
    DECLARE payload TEXT;
    BEGIN
      payload := json_build_object(
        'type','insert','id', NEW.id,'plantId', NEW.plant_id,'value', NEW.value,'status', NEW.status,'createdAt', NEW.created_at
      )::text;
      PERFORM pg_notify('readings_channel', payload);
      RETURN NULL;
    END; $$ LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION notify_readings_update() RETURNS trigger AS $$
    DECLARE payload TEXT;
    BEGIN
      payload := json_build_object(
        'type','update','id', NEW.id,'plantId', NEW.plant_id,'status', NEW.status,'updatedAt', NEW.updated_at
      )::text;
      PERFORM pg_notify('readings_channel', payload);
      RETURN NULL;
    END; $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_readings_insert ON readings;
    CREATE TRIGGER trg_readings_insert AFTER INSERT ON readings
    FOR EACH ROW EXECUTE FUNCTION notify_readings_insert();

    DROP TRIGGER IF EXISTS trg_readings_update ON readings;
    CREATE TRIGGER trg_readings_update AFTER UPDATE ON readings
    FOR EACH ROW EXECUTE FUNCTION notify_readings_update();
  `;
  await queryInterface.sequelize.query(sql); // Run the SQL via Sequelize connection
}

export async function down(queryInterface) {
  const sql = `
    DROP TRIGGER IF EXISTS trg_readings_insert ON readings;
    DROP TRIGGER IF EXISTS trg_readings_update ON readings;
    DROP FUNCTION IF EXISTS notify_readings_insert();
    DROP FUNCTION IF EXISTS notify_readings_update();
  `;
  await queryInterface.sequelize.query(sql); // Revert changes
}

// How it connects:

// NOTIFY target channel is 'readings_channel'; pgListener.js LISTENs this channel.
// Payload is JSON parsed in pgListener.js and routed to Socket.IO rooms.