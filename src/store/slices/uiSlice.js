import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authModal: null,
  bidModalSkin: null,
  viewMode: 'grid', 
  theme: localStorage.getItem('theme') || 'dark',
  currency: localStorage.getItem('currency') || 'RUB', // Сохраняем выбор валюты
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
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
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem('currency', action.payload);
    },
  },
});

export const {
  setAuthModal,
  setBidModalSkin,
  setViewMode,
  setTheme,
  toggleTheme,
  setCurrency,
} = uiSlice.actions;

// Экспортируем все селекторы
export const selectAuthModal = (state) => state.ui.authModal;
export const selectBidModalSkin = (state) => state.ui.bidModalSkin;
export const selectViewMode = (state) => state.ui.viewMode;
export const selectTheme = (state) => state.ui.theme;
export const selectCurrency = (state) => state.ui.currency;

export default uiSlice.reducer;