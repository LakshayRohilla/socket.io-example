import React from 'react';                                        // React core
import { createRoot } from 'react-dom/client';                    // Concurrent root API
import { Provider } from 'react-redux';                           // Redux context provider
import { store } from './app/store.js';                           // Configured store
import App from './App.jsx';                                      // Root component

const rootEl = document.getElementById('root');                   // Mount node
const root = createRoot(rootEl);                                  // Create root

root.render(
  <React.StrictMode>                                              // Strict mode checks
    <Provider store={store}>                                      // Provide Redux store
      <App />                                                     // Render app
    </Provider>
  </React.StrictMode>
);