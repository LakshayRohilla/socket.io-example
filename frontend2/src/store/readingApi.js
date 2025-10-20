// frontend/src/features/readings/readingsApi.js
import { api } from '../api/apiSlice.js';
export const readingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReadingsByPlant: builder.query({
      query: (plantId) => `/plants/${plantId}/readings`,
      providesTags: (result, _err, plantId) =>
        result ? [{ type: 'Readings', id: `PLANT-${plantId}` }] : [{ type: 'Readings', id: `PLANT-${plantId}` }]
    })
  })
});
export const { useGetReadingsByPlantQuery } = readingsApi;

// How it connects:

// Calls backend routes/readings.js endpoints to fetch initial data.
// Cache is updated by Socket.IO events via api.util.updateQueryData in ReadingsList.jsx.