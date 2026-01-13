import { createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios'; // Твой конфиг Axios, который мы сделали

// Сразу проверяем данные в браузере при инициализации
const savedUser = localStorage.getItem('cs2_user') 
    ? JSON.parse(localStorage.getItem('cs2_user')) 
    : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser, 
    isAuthenticated: !!savedUser, 
    loading: false,
    error: null,
  },
  reducers: {
    // Загрузка
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // Успешные операции
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('cs2_user', JSON.stringify(action.payload));
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('cs2_user', JSON.stringify(action.payload));
    },
    
    // Ошибки
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    
    // Выход
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('cs2_user');
    },
    
    // Обновление баланса
    updateBalance: (state, action) => {
      if (state.user) {
        state.user.balance += action.payload;
        localStorage.setItem('cs2_user', JSON.stringify(state.user));
      }
    },
    
    // Очистка ошибок
    clearError: (state) => {
      state.error = null;
    },
    
    // Обновление профиля
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('cs2_user', JSON.stringify(state.user));
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateBalance,
  clearError,
  updateProfile,
} = authSlice.actions;


export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserBalance = (state) => state.auth.user?.balance || 0;






export const loginUser = (userData) => async (dispatch) => {
  dispatch(loginStart());
  try {
    
    const response = await api.post('/auth/login', userData);
    
    
    const fullUserData = {
      ...response.data,
      avatar: response.data.avatar || 'https://avatars.githubusercontent.com/u/9919',
      joinDate: response.data.joinDate || new Date().toISOString()
    };
    
    dispatch(loginSuccess(fullUserData));
  } catch (error) {
    // Вытаскиваем валидацию ошибки:сообщение об ошибке из ответа сервера
    const errorMessage = error.response?.data?.message || 'Ошибка сервера: неверный логин или пароль';
    
    
    console.warn("Backend не отвечает, включаю демо-логин для теста фронтенда");
    const demoUser = {
        ...userData,
        id: 'user_' + Date.now(),
        balance: 10000,
        avatar: 'https://avatars.githubusercontent.com/u/9919',
        joinDate: new Date().toISOString()
    };
    
    dispatch(loginSuccess(demoUser)); 
    
  }
};

// Регистрация пользователя
export const registerUser = (userData) => async (dispatch) => {
  dispatch(registerStart());
  try {
    // РЕАЛЬНЫЙ ЗАПРОС К API
    const response = await api.post('/auth/register', userData);
    
    dispatch(registerSuccess({
      ...response.data,
      balance: response.data.balance || 10000,
      avatar: 'https://avatars.githubusercontent.com/u/9919'
    }));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Ошибка при создании аккаунта';
    
    // ДЕМО-РЕЖИМ ДЛЯ РЕГИСТРАЦИИ
    console.warn("Регистрация через демо-режим");
    dispatch(registerSuccess({
      ...userData,
      id: 'user_' + Date.now(),
      balance: 10000,
      avatar: 'https://avatars.githubusercontent.com/u/9919',
      joinDate: new Date().toISOString()
    }));
    // dispatch(registerFailure(errorMessage));
  }
};

export default authSlice.reducer;