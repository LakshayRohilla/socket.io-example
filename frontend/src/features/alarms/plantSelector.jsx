// Import React for rendering UI
import React from 'react'; // React core

// Define a plant selector component; controlled by parent via value and onChange
const PlantSelector = ({ value, onChange }) => { // Props: current value and change handler
  // Hard-coded plant list for demo; in production, fetch dynamically
  const plants = ['plant-01', 'plant-02', 'plant-03']; // Available plant IDs

  // Render a dropdown to select the plant
  return ( // JSX output
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}> {/* Container styling */}
      <strong>Select Plant:</strong> {/* Label */}
      <select
        value={value || ''} // Controlled value (empty string for none)
        onChange={(e) => onChange(e.target.value)} // Emit selected value to parent
      >
        <option value="" disabled>Select…</option> {/* Placeholder option */}
        {plants.map((p) => ( // Map through plant IDs
          <option key={p} value={p}> {/* Unique option per plant */}
            {p} {/* Display plantId */}
          </option>
        ))}
      </select>
    </div>
  );
};

// Export the component
export default PlantSelector; // Default export