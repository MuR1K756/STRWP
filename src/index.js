import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './AuthContext';
import { CurrencyProvider } from './CurrencyContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </AuthProvider>
  </React.StrictMode>
);