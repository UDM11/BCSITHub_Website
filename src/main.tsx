// Polyfill for `global` to fix Backendless "global is not defined" error
if (typeof global === 'undefined') {
  (window as any).global = window;
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
