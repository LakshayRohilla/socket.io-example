// Import React for JSX rendering
import React from 'react';
// Import ReactDOM for mounting the app
import { createRoot } from 'react-dom/client';
// Import Provider to make Redux store available to React
import { Provider } from 'react-redux';
// Import the configured Redux store
import { store } from './app/store.js';
// Import the root App component
import App from './App.jsx';

// Locate the root DOM node where React will mount
const rootEl = document.getElementById('root');
// Create a React root for concurrent rendering
const root = createRoot(rootEl);

// Render the application wrapped with Redux Provider
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);