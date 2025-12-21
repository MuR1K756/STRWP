import { createSlice } from '@reduxjs/toolkit';

const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    currency: localStorage.getItem('currency') || 'RUB',
    exchangeRates: {
      USD: 0.011,
      BYN: 0.036,
      RUB: 1
    }
  },
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem('currency', action.payload);
    },
    updateExchangeRates: (state, action) => {
      state.exchangeRates = { ...state.exchangeRates, ...action.payload };
    },
  },
});

export const { setCurrency, updateExchangeRates } = currencySlice.actions;

// Селекторы с защитой от undefined
export const selectCurrency = (state) => state.currency?.currency || 'RUB';
export const selectExchangeRates = (state) => state.currency?.exchangeRates || { RUB: 1 };

export const selectConvertedPrice = (state) => {
  const currency = state.currency?.currency || 'RUB';
  const rates = state.currency?.exchangeRates || { RUB: 1, USD: 0.011, BYN: 0.036 };

  return (priceInRub) => {
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