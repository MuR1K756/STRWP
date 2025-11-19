import { createSlice } from '@reduxjs/toolkit';

const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    currency: 'RUB',
    exchangeRates: {
      USD: 0.011,
      BYN: 0.036,
      RUB: 1
    }
  },
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    updateExchangeRates: (state, action) => {
      state.exchangeRates = { ...state.exchangeRates, ...action.payload };
    },
  },
});

export const { setCurrency, updateExchangeRates } = currencySlice.actions;

export default currencySlice.reducer;

// Селекторы
export const selectCurrency = (state) => state.currency.currency;
export const selectExchangeRates = (state) => state.currency.exchangeRates;

export const selectConvertedPrice = (currency, exchangeRates) => (priceInRub) => {
  const rate = exchangeRates[currency];
  const converted = priceInRub * rate;
  
  switch (currency) {
    case 'USD':
      return `$${converted.toFixed(2)}`;
    case 'BYN':
      return `${converted.toFixed(2)} BYN`;
    case 'RUB':
    default:
      return `${converted.toLocaleString()} ₽`;
  }
};