// Import configureStore to create a Redux store
import { configureStore } from '@reduxjs/toolkit';
// Import the RTK Query API slice to register reducer and middleware
import { api } from '../features/api/apiSlice.js';

// Create and export the Redux store
export const store = configureStore({
  // Register reducers with RTK Query reducer mounted at api.reducerPath
  reducer: {
    [api.reducerPath]: api.reducer
  },
  // Add RTK Query middleware for caching, polling, re-fetching
  middleware: (getDefault) => getDefault().concat(api.middleware)
});