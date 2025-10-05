// Import the Socket.IO Server class
import { Server } from 'socket.io';

// Initialize and configure a Socket.IO server bound to an HTTP server
export const initSocket = (httpServer, corsOrigin) => {
  // Create a new Socket.IO server with CORS options
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,     // Allow frontend origin
      methods: ['GET', 'POST'] // Allow these HTTP methods for polling fallback
    }
  });

  // Handle new websocket connections
  io.on('connection', (socket) => {
    // Log a debug message for new connections (optional)
    // console.log(`Socket connected: ${socket.id}`);

    // Listen for clients joining a plant room
    socket.on('room:join', (payload) => {
      try {
        // Extract plantId from payload
        const { plantId } = payload || {};
        // Validate plantId presence
        if (!plantId) return;

        // Leave any previously joined plant rooms to ensure single-plant membership
        for (const room of socket.rooms) {
          // Skip the default room (socket.id) and leave rooms starting with "plant:"
          if (room !== socket.id && room.startsWith('plant:')) {
            socket.leave(room);
          }
        }

        // Compute the room name for this plant
        const roomName = `plant:${plantId}`;
        // Join the plant room
        socket.join(roomName);
        // Acknowledge joining to the client (optional)
        socket.emit('room:joined', { room: roomName });
      } catch {
        // Silently ignore malformed payloads
      }
    });

    // Optional: Allow explicit leave if client desires
    socket.on('room:leave', (payload) => {
      try {
        // Extract plantId or leave all plant rooms if none provided
        const { plantId } = payload || {};
        if (plantId) {
          socket.leave(`plant:${plantId}`);
        } else {
          for (const room of socket.rooms) {
            if (room !== socket.id && room.startsWith('plant:')) {
              socket.leave(room);
            }
          }
        }
      } catch {
        // Silently ignore errors
      }
    });

    // Handle disconnections (for logging/cleanup if needed)
    socket.on('disconnect', () => {
      // console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  // Return the io instance so the caller can use it
  return io;
};