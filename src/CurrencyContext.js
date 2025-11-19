// import React, { createContext, useState, useContext } from 'react';

// const CurrencyContext = createContext();

// export const useCurrency = () => {
//   const context = useContext(CurrencyContext);
//   if (!context) {
//     throw new Error('useCurrency must be used within a CurrencyProvider');
//   }
//   return context;
// };

// export const CurrencyProvider = ({ children }) => {
//   const [currency, setCurrency] = useState('RUB'); // RUB, USD, BYN
//   const [exchangeRates, setExchangeRates] = useState({
//     USD: 0.011, // 1 RUB = 0.011 USD
//     BYN: 0.036, // 1 RUB = 0.036 BYN
//     RUB: 1
//   });

//   const convertPrice = (priceInRub) => {
//     const rate = exchangeRates[currency];
//     const converted = priceInRub * rate;
    
//     switch (currency) {
//       case 'USD':
//         return `$${converted.toFixed(2)}`;
//       case 'BYN':
//         return `${converted.toFixed(2)} BYN`;
//       case 'RUB':
//       default:
//         return `${converted.toLocaleString()} ₽`;
//     }
//   };

//   const updateExchangeRates = (newRates) => {
//     setExchangeRates(prev => ({ ...prev, ...newRates }));
//   };

//   return (
//     <CurrencyContext.Provider value={{
//       currency,
//       setCurrency,
//       convertPrice,
//       exchangeRates,
//       updateExchangeRates
//     }}>
//       {children}
//     </CurrencyContext.Provider>
//   );
// };