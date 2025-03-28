import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';
import { Toaster } from 'sonner'; // Import Toaster

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster richColors position="top-right" /> {/* Add Toaster */}
  </BrowserRouter>
);