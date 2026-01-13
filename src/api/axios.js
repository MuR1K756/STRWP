import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-cs2-market.example.com', // Фейковый или реальный адрес
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

// Перехватчик: можно автоматически добавлять токен к каждому запросу
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('cs2_user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;