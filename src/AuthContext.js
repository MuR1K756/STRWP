// import React, { createContext, useState, useContext } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const login = (userData) => {
//     const userWithBalance = {
//       ...userData,
//       balance: userData.balance || 10000 // Начальный баланс 10,000 ₽
//     };
//     setUser(userWithBalance);
//     setIsAuthenticated(true);
//     localStorage.setItem('cs2_user', JSON.stringify(userWithBalance));
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem('cs2_user');
//   };

//   const register = (userData) => {
//     const userWithBalance = {
//       ...userData,
//       balance: 10000 // Начальный баланс для новых пользователей
//     };
//     setUser(userWithBalance);
//     setIsAuthenticated(true);
//     localStorage.setItem('cs2_user', JSON.stringify(userWithBalance));
//   };

//   // Обновление баланса пользователя
//   const updateBalance = (amount) => {
//     if (user) {
//       const updatedUser = { ...user, balance: user.balance + amount };
//       setUser(updatedUser);
//       localStorage.setItem('cs2_user', JSON.stringify(updatedUser));
//     }
//   };

//   // Проверка авторизации при загрузке
//   React.useEffect(() => {
//     const savedUser = localStorage.getItem('cs2_user');
//     if (savedUser) {
//       const userData = JSON.parse(savedUser);
//       // Добавляем баланс если его нет у старых пользователей
//       if (!userData.balance) {
//         userData.balance = 10000;
//       }
//       setUser(userData);
//       setIsAuthenticated(true);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{
//       user,
//       isAuthenticated,
//       login,
//       logout,
//       register,
//       updateBalance
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };