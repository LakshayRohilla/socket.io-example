import React, { useEffect } from 'react';                              // React hooks
import { useDispatch } from 'react-redux';                             // Dispatch for RTK
import { socket } from '../../app/socket.js';                          // Shared socket
import { api } from '../api/apiSlice.js';                              // For updateQueryData
import { useGetReadingsByPlantQuery } from './readingsApi.js';         // REST fetch hook

const ReadingsList = ({ plantId }) => {
  const dispatch = useDispatch();                                      // Dispatch for cache updates

  const { data: readings = [], isLoading, isError, isSuccess } =
    useGetReadingsByPlantQuery(plantId, { skip: !plantId });           // Load initial data

  // Join the room on selection and reconnect
  useEffect(() => {
    const join = () => { if (plantId) socket.emit('room:join', { plantId }); };
    join();                                                            // Join immediately
    socket.on('connect', join);                                        // Re-join on reconnect
    return () => socket.off('connect', join);                          // Cleanup
  }, [plantId]);

  // Listen for realtime events and update RTK Query cache
  useEffect(() => {
    if (!plantId || !isSuccess) return;                                // Ensure data loaded

    const onNew = (r) => {                                             // Handler for inserts
      if (r?.plantId !== plantId) return;                              // Ignore other plants
      dispatch(api.util.updateQueryData('getReadingsByPlant', plantId, (draft) => {
        if (!draft.find((x) => String(x.id) === String(r.id))) draft.unshift(r); // De-dupe + prepend
      }));
    };

    const onUpdate = (r) => {                                          // Handler for updates
      if (r?.plantId !== plantId) return;
      dispatch(api.util.updateQueryData('getReadingsByPlant', plantId, (draft) => {
        const idx = draft.findIndex((x) => String(x.id) === String(r.id));
        if (idx !== -1) draft[idx] = { ...draft[idx], ...r };          // Patch fields
      }));
    };

    socket.on('reading:new', onNew);                                   // Register listeners
    socket.on('reading:update', onUpdate);

    return () => {                                                     // Cleanup on unmount/plant change
      socket.off('reading:new', onNew);
      socket.off('reading:update', onUpdate);
    };
  }, [plantId, dispatch, isSuccess]);

  if (!plantId) return <div>Select a plant.</div>;
  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>Error loading readings.</div>;

  return (
    <ul>
      {readings.map((r) => (
        <li key={r.id}>
          {r.value} ({r.status}) • {new Date(r.created_at || r.createdAt).toLocaleString()}
        </li>
      ))}
    </ul>
  );
};

export default ReadingsList;                                            // Used by App.jsx


// How it connects:

// Reads initial data via REST (readingsApi.js).
// Joins rooms via socket.emit('room:join', { plantId }) so socket.js (backend) places connection in plant:.
// Receives reading:new/update emitted by pgListener.js and patches RTK Query cache in-place.