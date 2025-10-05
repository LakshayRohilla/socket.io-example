// Import React and useState for local form state management
import React, { useState, useEffect } from 'react'; // React core and hooks
// Import the mutation hook to create a new alarm
import { useCreateAlarmMutation } from './alarmsApi.js'; // RTK Query mutation

// Define a form component for creating alarms; accepts current plantId
const CreateAlarmForm = ({ plantId }) => { // Component receives selected plantId
  // Local state for level selection
  const [level, setLevel] = useState('warn'); // Default alarm level
  // Local state for message input
  const [message, setMessage] = useState(''); // Alarm message text
  // Use RTK Query mutation hook
  const [createAlarm, { isLoading, isSuccess, isError }] = useCreateAlarmMutation(); // Mutation state

  // Clear form after successful creation
  useEffect(() => { // Effect monitors mutation success
    if (isSuccess) { // If creation succeeded
      setMessage(''); // Clear message field
      setLevel('warn'); // Reset level to default
    }
  }, [isSuccess]); // Re-run when success status changes

  // Handle form submission
  const onSubmit = async (e) => { // Submit handler
    e.preventDefault(); // Prevent default browser form submission
    if (!plantId || !level || !message) return; // Basic validation on fields
    try { // Attempt to create the alarm
      await createAlarm({ plantId, level, message }).unwrap(); // Call mutation and unwrap result
      // No need to manually update UI; socket event will push the new alarm
    } catch { // Handle failure silently (UI shows error state)
      // Intentionally empty; use isError to render feedback
    }
  };

  // If no plant selected, show a hint
  if (!plantId) { // Guard for missing plant
    return <div>Select a plant to create alarms.</div>; // Prompt message
  }

  // Render the form UI
  return ( // JSX form rendering
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 12, alignItems: 'center' }}> {/* Form container */}
      <strong>Create Alarm:</strong> {/* Form title */}
      <label> {/* Level label */}
        Level: {/* Label text */}
        <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ marginLeft: 6 }}> {/* Level select */}
          <option value="info">info</option> {/* Option: info */}
          <option value="warn">warn</option> {/* Option: warn */}
          <option value="critical">critical</option> {/* Option: critical */}
        </select>
      </label>
      <label style={{ flex: 1 }}> {/* Message label with flex growth */}
        Message: {/* Label text */}
        <input
          type="text" // Text input
          value={message} // Controlled value
          onChange={(e) => setMessage(e.target.value)} // Update message on change
          placeholder="Describe the alarm…" // Placeholder text
          style={{ width: '100%' }} // Stretch to fill available space
        />
      </label>
      <button type="submit" disabled={isLoading} style={{ padding: '6px 10px' }}> {/* Submit button */}
        {isLoading ? 'Creating…' : 'Create'} {/* Button label based on loading */}
      </button>
      {isError && <span style={{ color: 'red' }}>Failed to create alarm.</span>} {/* Error feedback */}
    </form>
  );
};

// Export the component
export default CreateAlarmForm; // Default export