import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    authModal: null, // 'login', 'register', null
    bidModalSkin: null,
    viewMode: 'grid', // 'grid', 'table'
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
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;

// Селекторы
export const selectAuthModal = (state) => state.ui.authModal;
export const selectBidModalSkin = (state) => state.ui.bidModalSkin;
export const selectViewMode = (state) => state.ui.viewMode;