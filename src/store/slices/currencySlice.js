import { createSlice } from '@reduxjs/toolkit';

const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    currency: localStorage.getItem('selected_currency') || 'RUB',
    exchangeRates: { USD: 0.011, BYN: 0.036, RUB: 1 }
  },
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem('selected_currency', action.payload);
    },
    updateExchangeRates: (state, action) => {
      state.exchangeRates = { ...state.exchangeRates, ...action.payload };
    },
  },
});

export const { setCurrency, updateExchangeRates } = currencySlice.actions;

export const selectCurrency = (state) => state.currency.currency;
export const selectExchangeRates = (state) => state.currency.exchangeRates;

// Возвращаем селектор-функцию, которую ждут твои компоненты
export const selectConvertedPrice = (state) => {
  // Возвращаем функцию-конвертер
  return (priceInput) => {
    if (!state.currency) return `${priceInput} ₽`; // Защита если стейт не готов
    
    const currency = state.currency.currency;
    const rates = state.currency.exchangeRates || { USD: 0.011, BYN: 0.036, RUB: 1 };
    const priceInRub = Number(priceInput) || 0;
    const rate = rates[currency] || 1;
    const converted = priceInRub * rate;

    switch (currency) {
      case 'USD': return `$${converted.toFixed(2)}`;
      case 'BYN': return `${converted.toFixed(2)} BYN`;
      default: return `${Math.round(converted).toLocaleString('ru-RU')} ₽`;
    }
  };
};

export default currencySlice.reducer;