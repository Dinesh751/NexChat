// api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true, // Send cookies
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    if (
      originalRequest.url.includes('/auth/') ||
      originalRequest.url.includes('/auth/register') ||
      originalRequest.url.includes('/auth/refresh-token')
    ) {
      return Promise.reject(error);
    }
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await api.post('/auth/refresh-token');
        const { token } = refreshRes.data;
        console.log('Refreshing token:', token);
        localStorage.setItem('auth_token', token);
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('auth_token');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;