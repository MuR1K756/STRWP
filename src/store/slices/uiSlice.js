import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    authModal: null,
    bidModalSkin: null,
    viewMode: 'grid', // Возвращаем для Table.js
    theme: localStorage.getItem('theme') || 'dark',
  },
  reducers: {
    setAuthModal: (state, action) => { state.authModal = action.payload; },
    setBidModalSkin: (state, action) => { state.bidModalSkin = action.payload; },
    setViewMode: (state, action) => { state.viewMode = action.payload; }, // Возвращаем экшен
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    }
  },
});

export const { 
  setAuthModal, 
  setBidModalSkin, 
  setViewMode, 
  setTheme, 
  toggleTheme 
} = uiSlice.actions;

export const selectTheme = (state) => state.ui.theme;
export const selectViewMode = (state) => state.ui.viewMode; // Возвращаем селектор
export const selectAuthModal = (state) => state.ui.authModal;
export const selectBidModalSkin = (state) => state.ui.bidModalSkin;

export default uiSlice.reducer;