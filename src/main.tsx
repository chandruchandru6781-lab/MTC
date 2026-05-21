import { initializeEnvironment } from './utils/envValidator'
import { firebaseDiagnostics } from './utils/firebaseDiagnostics'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enforce HTTPS in production
if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  if (window.location.protocol !== 'https:') {
    window.location.protocol = 'https:';
  }
}

// Initialize environment and validate configuration
initializeEnvironment();

// Run Firebase diagnostics in development and production
if (typeof window !== 'undefined') {
  firebaseDiagnostics.logDiagnostics();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
