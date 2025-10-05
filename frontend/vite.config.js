// Import defineConfig helper from Vite
import { defineConfig } from 'vite';
// Import React plugin for Vite
import react from '@vitejs/plugin-react';

// Export Vite configuration
export default defineConfig({
  plugins: [react()],    // Enable React fast refresh and JSX transform
  server: { port: 5173 } // Dev server port (must match backend CORS)
});