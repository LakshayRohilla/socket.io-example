// Create a single shared Socket.IO client for the whole app
import { io } from 'socket.io-client';

// Read server URL from Vite env
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Provide JWT at handshake time
const getToken = () => localStorage.getItem('jwt');

// Export a singleton socket instance
export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  auth: { token: getToken() }
});

// Optional: handle token refresh by updating auth and reconnecting
export const refreshSocketAuth = () => {
  socket.auth = { token: getToken() };
  if (socket.disconnected) socket.connect();
};

// How it connects:

// Used by App.jsx to join rooms.
// Used by ReadingsList.jsx to listen for reading:new/update events.
// JWT here must match server’s socket.js verification.