import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import database utilities for browser console access
import { clearDatabase } from './scripts/clearDatabase'
import { setupDatabase } from './scripts/setupDatabase'

// Expose functions to browser console for debugging
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).clearDatabase = clearDatabase;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).setupDatabase = setupDatabase
}

createRoot(document.getElementById("root")!).render(<App />);
