import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@renderer/app/App';
import { ErrorBoundary } from '@renderer/components/ErrorBoundary';
import '@renderer/styles/app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
