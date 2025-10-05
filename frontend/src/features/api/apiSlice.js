// Import createApi and fetchBaseQuery from RTK Query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Resolve REST API base URL from environment with a sensible default
const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE_URL) ||
  'http://localhost:4000';

// Create and export a base RTK Query API slice
export const api = createApi({
  reducerPath: 'api',                               // State key for RTK Query cache
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }), // HTTP fetching base
  tagTypes: ['Alarms'],                              // Tag type for invalidation if desired
  endpoints: () => ({})                              // Endpoints injected elsewhere
});