import { createSlice } from '@reduxjs/toolkit';

// Проверяем сохраненную тему или системные настройки
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('cs2_theme');
  if (savedTheme) return savedTheme;
  
  // Проверяем системные настройки
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light'; // тема по умолчанию
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    authModal: null, // 'login', 'register', null
    bidModalSkin: null,
    viewMode: 'grid', // 'grid', 'table'
    theme: getInitialTheme(), // 'light', 'dark'
  },
  reducers: {
    setAuthModal: (state, action) => {
      state.authModal = action.payload;
    },
    setBidModalSkin: (state, action) => {
      state.bidModalSkin = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('cs2_theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('cs2_theme', state.theme);
    },
    closeAllModals: (state) => {
      state.authModal = null;
      state.bidModalSkin = null;
    },
  },
});

export const {
  setAuthModal,
  setBidModalSkin,
  setViewMode,
  setTheme,
  toggleTheme,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;

// Селекторы
export const selectAuthModal = (state) => state.ui.authModal;
export const selectBidModalSkin = (state) => state.ui.bidModalSkin;
export const selectViewMode = (state) => state.ui.viewMode;
export const selectTheme = (state) => state.ui.theme;