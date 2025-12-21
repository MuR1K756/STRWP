import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { selectTheme, toggleTheme, setAuthModal } from '../store/slices/uiSlice';
import { setCurrency, selectCurrency } from '../store/slices/currencySlice';
import { selectUser, selectIsAuthenticated, logout } from '../store/slices/authSlice';

const Layout = () => {
  const theme = useAppSelector(selectTheme);
  const currency = useAppSelector(selectCurrency);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const isDark = theme === 'dark';
  
  const handleToggleTheme = () => dispatch(toggleTheme());
  const handleOpenLogin = () => dispatch(setAuthModal('login'));
  const handleLogout = () => dispatch(logout());

  const handleCurrencyChange = (e) => {
    dispatch(setCurrency(e.target.value));
  };

  const styles = {
    nav: {
      backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
      padding: '1rem 0',
      boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    navContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '2rem', // Увеличил отступ между лого и навигацией
    },
    navLogo: {
      color: isDark ? '#4ecdc4' : '#800020',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
    },
    navCategories: {
      display: 'flex',
      flexDirection: 'row', // ГАРАНТИРУЕМ ГОРИЗОНТАЛЬ
      alignItems: 'center',
      gap: '1rem',
      flexGrow: 1, // Занимает всё свободное место
    },
    navCategory: {
      color: isDark ? '#ffffff' : '#333333',
      textDecoration: 'none',
      fontSize: '0.9rem',
      padding: '0.6rem 1rem',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      whiteSpace: 'nowrap', // Чтобы текст не переносился
    },
    navRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    currencySelect: {
      backgroundColor: isDark ? '#2a2a4a' : '#f0f0f0',
      color: isDark ? '#ffffff' : '#333333',
      border: 'none',
      padding: '0.6rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
    },
    authButton: {
      backgroundColor: isDark ? '#b01b2e' : '#800020',
      color: '#ffffff',
      border: 'none',
      padding: '0.6rem 1.2rem',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
    },
    themeButton: {
      background: 'none',
      border: `1px solid ${isDark ? '#4ecdc4' : '#800020'}`,
      cursor: 'pointer',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem'
    }
  };

  return (
    <div className={`layout theme-${theme}`}>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <Link to="/" style={styles.navLogo}>🎯 MARKET</Link>
          
          {/* ИСПРАВЛЕННЫЙ БЛОК КАТЕГОРИЙ */}
          <div style={styles.navCategories}>
            <Link to="/" style={styles.navCategory}>🏠 Главная</Link>
            <Link to="/knives" style={styles.navCategory}>🔪 Ножи</Link>
            <Link to="/pistols" style={styles.navCategory}>🎯 Пистолеты</Link>
            <Link to="/rifles" style={styles.navCategory}>🔫 Винтовки</Link>
            <Link to="/profile" style={styles.navCategory}>👤 Профиль</Link>
          </div>
          
          <div style={styles.navRight}>
            <select 
              style={styles.currencySelect} 
              value={currency} 
              onChange={handleCurrencyChange}
            >
              <option value="USD">USD $</option>
              <option value="BYN">BYN</option>
              <option value="RUB">RUB ₽</option>
            </select>

            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: isDark ? '#4ecdc4' : '#333', fontWeight: '500' }}>{user?.username}</span>
                <button style={styles.authButton} onClick={handleLogout}>Выйти</button>
              </div>
            ) : (
              <button style={styles.authButton} onClick={handleOpenLogin}>Войти</button>
            )}

            <button onClick={handleToggleTheme} style={styles.themeButton}>
              {isDark ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 20px', minHeight: '80vh' }}>
        <Outlet />
      </main>

      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        background: isDark ? '#16213e' : '#800020', 
        color: '#fff',
        marginTop: 'auto' 
      }}>
        <p>CS2 Skin Market &copy; 2025 — Лучшие цены на скины</p>
      </footer>
    </div>
  );
};

export default Layout;