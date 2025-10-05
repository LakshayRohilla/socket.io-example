// Import React and useEffect for lifecycle hooks
import React, { useEffect } from 'react'; // React core and hooks
// Import useDispatch to dispatch actions to Redux store
import { useDispatch } from 'react-redux'; // Redux dispatch hook
// Import the singleton Socket.IO client
import { socket } from '../../app/socket.js'; // Shared socket client
// Import the base RTK Query API to perform cache updates
import { api } from '../api/apiSlice.js'; // RTK Query base slice
// Import hooks for querying alarms and acknowledging an alarm
import {
  useGetAlarmsByPlantQuery, // Hook to fetch alarms by plant
  useAcknowledgeAlarmMutation // Hook to acknowledge an alarm
} from './alarmsApi.js'; // Alarms API endpoints

// Define the AlarmsList component, expecting a plantId prop
const AlarmsList = ({ plantId }) => { // Component receives the selected plantId
  // Get the Redux dispatch function
  const dispatch = useDispatch(); // Used to update RTK Query cache

  // Use RTK Query to fetch alarms for the given plant; skip if plantId is not set
  const { data: alarms = [], isLoading, isError } = useGetAlarmsByPlantQuery(plantId, { // Destructure query state
    skip: !plantId // Avoid querying until a plant is selected
  });

  // Prepare the mutation hook for acknowledging an alarm
  const [acknowledgeAlarm, { isLoading: isAcking }] = useAcknowledgeAlarmMutation(); // Mutation state for ACK

  // Subscribe to Socket.IO events and update RTK Query cache in real time
  useEffect(() => { // Effect runs when plantId changes
    // Do nothing if plantId is not defined
    if (!plantId) return; // Guard clause for missing plant

    // Define the handler for a new alarm event
    const handleNewAlarm = (alarm) => { // Handler receives the alarm payload
      // Ensure the event belongs to the current plant
      if (alarm?.plantId !== plantId) return; // Ignore alarms for other plants
      // Update the cached list by inserting the new alarm at the start (newest first)
      dispatch( // Dispatch a cache update
        api.util.updateQueryData('getAlarmsByPlant', plantId, (draft) => { // Target the specific query cache
          draft.unshift(alarm); // Insert at the front of the array
        })
      );
    };

    // Define the handler for an acknowledgement event
    const handleAck = (payload) => { // Handler receives ACK payload
      // Ensure the event belongs to the current plant
      if (payload?.plantId !== plantId) return; // Ignore events for other plants
      // Update the cached item to mark it as acknowledged
      dispatch( // Dispatch a cache update
        api.util.updateQueryData('getAlarmsByPlant', plantId, (draft) => { // Access cached alarms
          const idx = draft.findIndex((a) => a.id === payload.id); // Find the alarm by id
          if (idx !== -1) draft[idx].acknowledged = true; // Set acknowledged flag if found
        })
      );  
    };

    // Register the Socket.IO event listeners
    socket.on('alarm:new', handleNewAlarm); // Listen for new alarms
    socket.on('alarm:ack', handleAck); // Listen for acknowledgements

    // Cleanup listeners when the component unmounts or plantId changes
    return () => { // Cleanup function
      socket.off('alarm:new', handleNewAlarm); // Remove new alarm handler
      socket.off('alarm:ack', handleAck); // Remove ACK handler
    };
  }, [dispatch, plantId]); // Dependencies ensure effect re-runs on plant change

  // Handle empty plant selection case
  if (!plantId) return <div>Please select a plant.</div>; // Prompt to select a plant

  // Handle loading state
  if (isLoading) return <div>Loading alarms…</div>; // Display loading message

  // Handle error state
  if (isError) return <div>Failed to load alarms.</div>; // Display error message

  // Render the list of alarms
  return ( // JSX rendering block
    <div style={{ marginTop: 16 }}> {/* Container with top margin */}
      <h3>Alarms for {plantId}</h3> {/* Section header with plantId */}
      {alarms.length === 0 ? ( // Conditional rendering for empty list
        <div>No alarms</div> // Empty state message
      ) : ( // Render alarms when present
        <ul style={{ listStyle: 'none', padding: 0 }}> {/* Unstyled list */}
          {alarms.map((a) => ( // Iterate over alarms
            <li
              key={a.id} // Unique key for React list
              style={{
                display: 'flex', // Use flex layout
                alignItems: 'center', // Vertical alignment
                gap: 12, // Spacing between items
                padding: '8px 12px', // Item padding
                border: '1px solid #ddd', // Light border
                borderRadius: 6, // Rounded corners
                marginBottom: 8, // Spacing below item
                backgroundColor: a.acknowledged ? '#f6f6f6' : '#fffbea' // Visual cue for ack state
              }}
            >
              <span style={{ minWidth: 80, fontWeight: 600 }}> {/* Level label container */}
                {a.level.toUpperCase()} {/* Render alarm level in uppercase */}
              </span>
              <span style={{ flex: 1 }}> {/* Message container occupying remaining width */}
                {a.message} {/* Render alarm message */}
                <span style={{ color: '#666', marginLeft: 8 }}> {/* Timestamp style */}
                  • {new Date(a.createdAt).toLocaleString()} {/* Human-readable timestamp */}
                </span>
              </span>
              <span> {/* Acknowledgement status label */}
                {a.acknowledged ? 'Acknowledged' : 'Unacknowledged'} {/* Ack status text */}
              </span>
              <button
                onClick={() => acknowledgeAlarm(a.id)} // Trigger ACK mutation
                disabled={a.acknowledged || isAcking} // Disable if already acknowledged or processing
                style={{
                  padding: '6px 10px', // Button padding
                  borderRadius: 4, // Rounded button corners
                  border: '1px solid #ccc', // Button border
                  backgroundColor: '#e6f4ff', // Button background
                  cursor: a.acknowledged ? 'not-allowed' : 'pointer' // Cursor style based on state
                }}
              >
                Acknowledge {/* Button label */}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Export the component as default
export default AlarmsList; // Default export for import usage