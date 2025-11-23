// Central axios setup run once at app startup.
import axios from 'axios';

// Resolve API base in this order:
// 1. Vite build-time env var (VITE_API_URL) - set at build time for production
// 2. Runtime override window.__PHARMAPIN_RUNTIME_API__ (useful for injecting at runtime without rebuild)
// 3. For production, use the Render backend URL
const PROD_API = import.meta.env.VITE_API_URL || '';
const RUNTIME_API = (typeof window !== 'undefined' && window.__PHARMAPIN_RUNTIME_API__) ? window.__PHARMAPIN_RUNTIME_API__ : '';

// Use the resolved API base - CRITICAL: Point to your Render backend
const RESOLVED_API = PROD_API || RUNTIME_API || 'https://your-render-backend-url.onrender.com/api';

axios.defaults.baseURL = RESOLVED_API;

// Debug: log the effective axios baseURL
console.log('axiosSetup: axios.defaults.baseURL =', axios.defaults.baseURL, ' (VITE_API_URL=', import.meta.env.VITE_API_URL, ' RUNTIME=', RUNTIME_API, ')');

export default axios;