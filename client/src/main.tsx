import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import { AuthProvider } from './components/contexts/AuthContext';
import { StateManagerProvider } from './components/StateManager';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <StateManagerProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StateManagerProvider>
    </Provider>
  </React.StrictMode>,
);
