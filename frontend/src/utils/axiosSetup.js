// Central axios setup run once at app startup.
// Sets a baseURL from Vite env (VITE_API_URL) and rewrites any hardcoded localhost URLs
// so existing absolute URLs in code continue to work in production without editing every file.
import axios from 'axios';

const PROD_API = import.meta.env.VITE_API_URL || '';

// Use the Vite-provided API url when available, otherwise default to empty string
// so dev proxy or absolute URLs still function.
axios.defaults.baseURL = PROD_API || '';

// Intercept requests and rewrite any absolute localhost URLs to be relative so they use baseURL.
axios.interceptors.request.use((config) => {
  try {
    if (config && config.url && typeof config.url === 'string') {
      const localhostPrefix = 'http://localhost:5000';
      const localhostSecure = 'https://localhost:5000';
      if (config.url.startsWith(localhostPrefix)) {
        config.url = config.url.replace(localhostPrefix, '');
      } else if (config.url.startsWith(localhostSecure)) {
        config.url = config.url.replace(localhostSecure, '');
      }
    }
  } catch (e) {
    // Non-fatal; do not block requests if rewriting fails
    // eslint-disable-next-line no-console
    console.debug('axiosSetup: request interceptor error', e?.message || e);
  }
  return config;
}, (error) => Promise.reject(error));

// Optionally export axios for convenience
// Debug: log the effective axios baseURL at startup to help diagnose requests
// eslint-disable-next-line no-console
console.debug('axiosSetup: axios.defaults.baseURL =', axios.defaults.baseURL);

export default axios;
