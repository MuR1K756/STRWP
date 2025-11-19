import { configureStore } from '@reduxjs/toolkit';
import skinsReducer from './slices/skinsSlice';
import authReducer from './slices/authSlice';
import currencyReducer from './slices/currencySlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    skins: skinsReducer,
    auth: authReducer,
    currency: currencyReducer,
    ui: uiReducer,
  },
});

export default store;