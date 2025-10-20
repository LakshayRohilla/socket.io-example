import React, { useState, useEffect } from 'react';                    // React
import { socket, refreshSocketAuth } from './app/socket.js';           // Socket singleton
import PlantSelector from './features/readings/PlantSelector.jsx';     // Plant picker
import ReadingsList from './features/readings/ReadingsList.jsx';       // Live list

const App = () => {
  const [plantId, setPlantId] = useState('');                          // Selected plant

  useEffect(() => {
    // If JWT changes (e.g., login/refresh), refresh socket auth
    // refreshSocketAuth(); // Uncomment if you manage token refresh here
  }, []);

  // Optional: listen to room confirmation
  useEffect(() => {
    const onJoined = ({ plantId: p }) => { /* Optionally log/handle */ };
    socket.on('room:joined', onJoined);
    return () => socket.off('room:joined', onJoined);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 16 }}>
      <h2>Plant Readings Dashboard</h2>
      <PlantSelector value={plantId} onChange={setPlantId} />
      <div style={{ height: 12 }} />
      <ReadingsList plantId={plantId} />
    </div>
  );
};

export default App;

// How it connects:

// Holds plantId state passed to ReadingsList.
// ReadingsList performs both the REST fetch and the room join + realtime subscriptions.