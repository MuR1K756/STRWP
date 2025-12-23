import { createSlice } from '@reduxjs/toolkit';

// ВАЖНО: Сразу при загрузке файла проверяем наличие данных в браузере
const savedUser = localStorage.getItem('cs2_user') 
    ? JSON.parse(localStorage.getItem('cs2_user')) 
    : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // Теперь при F5 Redux сразу подхватит пользователя
    user: savedUser, 
    isAuthenticated: !!savedUser, // true если есть user, false если нет
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

export default authSlice.reducer;


export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserBalance = (state) => state.auth.user?.balance || 0;


export const loginUser = (userData) => async (dispatch) => {
  dispatch(loginStart());
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userWithBalance = {
      ...userData,
      id: userData.id || 'user_' + Date.now(), 
      balance: userData.balance || 10000,
      avatar: 'https://avatars.githubusercontent.com/u/9919',
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
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userWithBalance = {
      ...userData,
      id: 'user_' + Date.now(),
      balance: 10000, 
      avatar: 'https://avatars.githubusercontent.com/u/9919',
      joinDate: new Date().toISOString()
    };
    
    dispatch(registerSuccess(userWithBalance));
  } catch (error) {
    dispatch(registerFailure(error.message));
  }
};