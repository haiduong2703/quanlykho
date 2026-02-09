import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Only redirect to login on 401 if NOT already on login page
    // and if there was a token (meaning session expired)
    if (error.response?.status === 401) {
      const hadToken = localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if we had a token and are not on login page
      if (hadToken && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Return error message from server or generic error
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    return Promise.reject({ message: errorMessage });
  }
);

export default api;
