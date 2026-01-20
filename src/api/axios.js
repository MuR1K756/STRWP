import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/', 
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});


api.interceptors.request.use((config) => {
  const user = localStorage.getItem('cs2_user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;