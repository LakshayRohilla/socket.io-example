// Import the base API to inject endpoints
import { api } from '../api/apiSlice.js';

// Inject alarm-related endpoints
export const alarmsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET: fetch alarms for a specific plant
    getAlarmsByPlant: builder.query({
      // Build URL using the plantId
      query: (plantId) => `/plants/${encodeURIComponent(plantId)}/alarms`,
      // Provide tags (optional; helpful if you want to invalidate)
      providesTags: (result, _err, plantId) =>
        result
          ? [
              ...result.map((a) => ({ type: 'Alarms', id: a.id })), // tag each alarm
              { type: 'Alarms', id: `PLANT-${plantId}` }            // tag per plant
            ]
          : [{ type: 'Alarms', id: `PLANT-${plantId}` }]
    }),

    // POST: create a new alarm
    createAlarm: builder.mutation({
      // Send JSON body to /alarms
      query: (body) => ({ url: '/alarms', method: 'POST', body }),
      // Optionally invalidate plant-level to refetch (not strictly needed with socket updates)
      invalidatesTags: (result) =>
        result ? [{ type: 'Alarms', id: `PLANT-${result.plantId}` }] : []
    }),

    // POST: acknowledge an alarm by id
    acknowledgeAlarm: builder.mutation({
      // POST to /alarms/:id/ack
      query: (id) => ({ url: `/alarms/${id}/ack`, method: 'POST' }),
      // Optionally invalidate this specific alarm
      invalidatesTags: (result) =>
        result ? [{ type: 'Alarms', id: result.id }] : []
    })
  })
});

// Export auto-generated hooks
export const {
  useGetAlarmsByPlantQuery,
  useCreateAlarmMutation,
  useAcknowledgeAlarmMutation
} = alarmsApi;