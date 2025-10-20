import { Server } from 'socket.io';                     // Socket.IO server
import jwt from 'jsonwebtoken';                         // JWT verification

export const initSocket = (httpServer, corsOrigin) => {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin, methods: ['GET','POST'] } // Allow frontend origin
  });

  // Auth: verify JWT from handshake
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;              // From frontend auth option
      if (!token) return next(new Error('Unauthorized'));
      const user = jwt.verify(                                 // Verify signature/expiry
        token,
        process.env.JWT_PUBLIC_KEY || process.env.JWT_SECRET,
        { algorithms: process.env.JWT_ALG ? [process.env.JWT_ALG] : ['RS256','HS256'] }
      );
      socket.data.user = user;                                  // Attach claims for authorization
      next();                                                   // Proceed
    } catch {
      next(new Error('Unauthorized'));                          // Reject connection
    }
  });

  // Client connected
  io.on('connection', (socket) => {
    // Join a single plant room
    socket.on('room:join', ({ plantId }) => {
      if (!plantId) return;                                     // Validate input

      // Optional authZ: require claim to include plantId
      const allowed = Array.isArray(socket.data.user?.allowedPlants)
        ? socket.data.user.allowedPlants.includes(plantId)
        : true;
      if (!allowed) return socket.emit('room:rejected', { plantId, reason: 'forbidden' });

      // Leave any previous plant rooms (single-plant mode)
      for (const room of socket.rooms) {
        if (room !== socket.id && room.startsWith('plant:')) socket.leave(room);
      }

      // Join the target plant room
      socket.join(`plant:${plantId}`);

      // Confirm membership to client
      socket.emit('room:joined', { plantId });
    });

    // Optional explicit leave (not required if you auto-leave on next join)
    socket.on('room:leave', ({ plantId } = {}) => {
      if (plantId) socket.leave(`plant:${plantId}`);
      else {
        for (const room of socket.rooms) {
          if (room !== socket.id && room.startsWith('plant:')) socket.leave(room);
        }
      }
      socket.emit('room:left', { plantId: plantId || '*', ok: true });
    });
  });

  return io; // Returned to server.js and pgListener.js
};

// How it connects:

// Instantiated in server.js and passed to pgListener.js.
// Frontend’s socket (frontend/src/app/socket.js) provides JWT in handshake and emits room:join.
