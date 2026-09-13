import './utils/animation';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HardwareProvider } from './context/HardwareContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HardwareProvider><App /></HardwareProvider>
  </StrictMode>,
);
