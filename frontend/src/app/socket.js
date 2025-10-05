// Import io factory from socket.io-client
import { io } from 'socket.io-client';

// Resolve Socket.IO server URL from environment with a fallback
const SOCKET_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SOCKET_URL) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_SOCKET_URL) ||
  'http://localhost:4000';

// Create a singleton Socket.IO client instance
export const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Prefer WebSocket transport
  autoConnect: true          // Connect immediately
});