import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
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
    
    // Загрузка из localStorage
    setUserFromStorage: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
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
  setUserFromStorage,
  clearError,
  updateProfile,
} = authSlice.actions;

export default authSlice.reducer;

// Селекторы
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserBalance = (state) => state.auth.user?.balance || 0;

// Thunk actions для асинхронных операций (если нужно)
export const loginUser = (userData) => async (dispatch) => {
  dispatch(loginStart());
  try {
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // В реальном приложении здесь был бы запрос к API
    // const response = await api.login(userData);
    
    const userWithBalance = {
      ...userData,
      id: Date.now(),
      balance: userData.balance || 10000,
      avatar: '👤',
      joinDate: new Date().toISOString()
    };
    
    dispatch(loginSuccess(userWithBalance));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const registerUser = (userData) => async (dispatch) => {
  dispatch(registerStart());
  try {
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // В реальном приложении здесь был бы запрос к API
    // const response = await api.register(userData);
    
    const userWithBalance = {
      ...userData,
      id: Date.now(),
      balance: 10000, // Стартовый баланс
      avatar: '👤',
      joinDate: new Date().toISOString()
    };
    
    dispatch(registerSuccess(userWithBalance));
  } catch (error) {
    dispatch(registerFailure(error.message));
  }
};