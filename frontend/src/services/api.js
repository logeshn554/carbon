import axios from 'axios';

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL;
  if (url) {
    url = url.trim();
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (!url.endsWith('/api')) url = `${url}/api`;
    return url;
  }
  if (import.meta.env.DEV) return '/api';
  return 'https://carbon-production-49fd.up.railway.app/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — add any auth headers here in future
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    let message = data?.error || data?.message || error.message || 'An unexpected error occurred';

    if (data?.details && Array.isArray(data.details)) {
      const detailsStr = data.details.map((d) => `${d.field}: ${d.message}`).join(', ');
      message = `${message} (${detailsStr})`;
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
