import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bulma/css/bulma.css';
import './index.css';
import App from './App.tsx';
import { MemoryGameProvider } from './context/MemoryGameContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MemoryGameProvider>
      <App />
    </MemoryGameProvider>
  </StrictMode>,
);
