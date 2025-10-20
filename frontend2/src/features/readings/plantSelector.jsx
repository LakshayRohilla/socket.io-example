import React from 'react';                                             // React

const PlantSelector = ({ value, onChange }) => {                       // Controlled component
  const plants = ['plant-01', 'plant-02', 'plant-03'];                 // Demo list (fetch in prod)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <strong>Select Plant:</strong>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>Select…</option>
        {plants.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  );
};

export default PlantSelector;                                          // Used by App.jsx

// How it connects:

// App.jsx lifts state and uses selected plantId to join rooms and render ReadingsList.