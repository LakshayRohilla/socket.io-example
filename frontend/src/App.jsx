// Import React and useState/useEffect for app state and side effects
import React, { useEffect, useState } from 'react'; // React core and hooks
// Import the singleton Socket.IO client
import { socket } from './app/socket.js'; // Shared socket client
// Import the PlantSelector component
import PlantSelector from './features/alarms/plantSelector.jsx'; // Plant picker UI
// Import the CreateAlarmForm component
import CreateAlarmForm from './features/alarms/createAlarmForm.jsx'; // Alarm creation form
// Import the AlarmsList component
import AlarmsList from './features/alarms/AlarmsList.jsx'; // Alarm list display

// Root application component
const App = () => { // Define App component
  // Local state to track the currently selected plant
  const [plantId, setPlantId] = useState(''); // Selected plant ID

  // Join the appropriate Socket.IO room whenever plantId changes
  useEffect(() => { // Effect runs on plant change
    if (!plantId) return; // Do nothing if no plant selected
    socket.emit('room:join', { plantId }); // Join the server-side room for this plant
    // Optional: listen for confirmation
    const handleJoined = (payload) => { /* no-op confirmation handler */ }; // Placeholder
    socket.on('room:joined', handleJoined); // Listen to room joined confirmation
    return () => { // Cleanup on plant change/unmount
      socket.off('room:joined', handleJoined); // Remove confirmation listener
    };
  }, [plantId]); // Dependency array ensures effect runs on plant change

  // Render the application layout
  return ( // JSX rendering
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 16 }}> {/* Page container */}
      <h2>Plant Alarm Dashboard</h2> {/* Page header */}
      <PlantSelector value={plantId} onChange={setPlantId} /> {/* Plant selection */}
      <div style={{ height: 12 }} /> {/* Spacer */}
      <CreateAlarmForm plantId={plantId} /> {/* Alarm creation form for selected plant */}
      <div style={{ height: 12 }} /> {/* Spacer */}
      <AlarmsList plantId={plantId} /> {/* Live alarm list */}
    </div>
  );
};

// Export the root component
export default App; // Default export