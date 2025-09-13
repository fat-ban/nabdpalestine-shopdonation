import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { AuthProvider } from './components/contexts/AuthContext.js';
import { StateManagerProvider } from './components/StateManager.js';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { apiSlice } from './features/api/apiSlice.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider api={apiSlice}>
      <StateManagerProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StateManagerProvider>
    </ApiProvider>
  </React.StrictMode>,
);
