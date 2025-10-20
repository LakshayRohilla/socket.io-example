createApi with baseQuery fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }).
tagTypes (e.g., Readings).
Export api to inject endpoints from readingsApi.js. How it connects:
ReadingsList.jsx calls useGetReadingsByPlantQuery from readingsApi.js which is built on this base.