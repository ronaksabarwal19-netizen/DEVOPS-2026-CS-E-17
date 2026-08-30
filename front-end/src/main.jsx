// ─── Entry Point ─────────────────────────────────────────────────────────────
// Bootstraps React, seeds localStorage with mock data on first load,
// and mounts the root <App /> into #root.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { seedData } from './utils/localStorage.js';

// Seed mock data into localStorage on first visit (no-op if data exists)
seedData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
