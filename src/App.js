import './App.css';
import Table from "./Table";
import Form from "./Form";
import Login from './components/Login'; 
import Register from './components/Register';
import BidModal from './components/BidModal';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { useEffect } from "react";

// Импорты из skinsSlice
import {
  selectFilteredSkins,
  selectWeapons,
  selectEditingSkin,
  selectSelectedSkin,
  selectSearchTerm,
  selectSelectedWeapon,
  setSearchTerm,
  setSelectedWeapon,
  setEditingSkin,
  clearEditingSkin,
  setSelectedSkin,
  clearSelectedSkin,
  addSkin,
  updateSkin,
  deleteSkin,
  addBid,
  cancelBid,
} from './store/slices/skinsSlice';

// Импорты из authSlice
import {
  selectUser,
  selectIsAuthenticated,
  logout,
  updateBalance,
  setUserFromStorage,
} from './store/slices/authSlice';

// Импорты из currencySlice
import {
  selectCurrency,
  selectExchangeRates,
  selectConvertedPrice,
  setCurrency,
} from './store/slices/currencySlice';

// Импорты из uiSlice
import {
  selectAuthModal,
  selectBidModalSkin,
  selectViewMode,
  selectTheme,
  setAuthModal,
  setBidModalSkin,
  setViewMode,
  toggleTheme,
} from './store/slices/uiSlice';

function App() {
  const dispatch = useAppDispatch();
  
  // Селекторы
  const skins = useAppSelector(selectFilteredSkins);
  const weapons = useAppSelector(selectWeapons);
  const editingSkin = useAppSelector(selectEditingSkin);
  const selectedSkin = useAppSelector(selectSelectedSkin);
  const searchTerm = useAppSelector(selectSearchTerm);
  const selectedWeapon = useAppSelector(selectSelectedWeapon);
  
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const currency = useAppSelector(selectCurrency);
  const exchangeRates = useAppSelector(selectExchangeRates);
  const convertPrice = selectConvertedPrice(currency, exchangeRates);
  
  const authModal = useAppSelector(selectAuthModal);
  const bidModalSkin = useAppSelector(selectBidModalSkin);
  const viewMode = useAppSelector(selectViewMode);
  const theme = useAppSelector(selectTheme); // НОВЫЙ селектор темы

  // Применяем тему к корневому элементу
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Загрузка пользователя из localStorage при запуске
  useEffect(() => {
    const savedUser = localStorage.getItem('cs2_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Добавляем баланс если его нет у старых пользователей
        if (!userData.balance) {
          userData.balance = 10000;
        }
        dispatch(setUserFromStorage(userData));
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
        localStorage.removeItem('cs2_user');
      }
    }
  }, [dispatch]);

  // Обработчики скинов
  const handleDeleteSkin = (id) => {
    dispatch(deleteSkin(id));
  };

  const handleAddSkin = (skin) => {
    dispatch(addSkin(skin));
  };

  const handleUpdateSkin = (skin) => {
    dispatch(updateSkin(skin));
    dispatch(clearEditingSkin());
  };

  const handleStartEdit = (skin) => {
    if (!isAuthenticated) {
      dispatch(setAuthModal('login'));
      return;
    }
    dispatch(setEditingSkin(skin));
  };

  const handleCancelEdit = () => {
    dispatch(clearEditingSkin());
  };

  const handleShowSkinDetails = (skin) => {
    dispatch(setSelectedSkin(skin));
  };

  const handleCloseSkinDetails = () => {
    dispatch(clearSelectedSkin());
  };

  // Обработчики ставок
  const handleMakeBid = (skin) => {
    if (!isAuthenticated) {
      dispatch(setAuthModal('login'));
      return;
    }
    dispatch(setBidModalSkin(skin));
  };

  const handleSubmitBid = (skinId, amount) => {
    if (!user) return;
    
    dispatch(addBid({
      skinId,
      userId: user.id,
      userName: user.name,
      amount
    }));
    dispatch(updateBalance(-amount));
    dispatch(setBidModalSkin(null));
  };

  const handleCancelBid = (skinId, bidId) => {
    if (!user) return;
    
    // ИСПРАВЛЕНО: берем refundAmount из payload
    const actionResult = dispatch(cancelBid({
      skinId,
      bidId,
      userId: user.id
    }));
    
    const refundAmount = actionResult.payload;
    if (refundAmount > 0) {
      dispatch(updateBalance(refundAmount));
    }
  };

  // Обработчики UI
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSetCurrency = (newCurrency) => {
    dispatch(setCurrency(newCurrency));
  };

  const handleSetSearchTerm = (term) => {
    dispatch(setSearchTerm(term));
  };

  const handleSetSelectedWeapon = (weapon) => {
    dispatch(setSelectedWeapon(weapon));
  };

  const handleCloseAuthModal = () => {
    dispatch(setAuthModal(null));
  };

  const handleCloseBidModal = () => {
    dispatch(setBidModalSkin(null));
  };

  // НОВЫЙ: Переключение темы
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // Статистика для хедера
  const totalSkins = skins.length;
  const totalBids = skins.reduce((sum, skin) => 
    sum + (skin.bids ? skin.bids.filter(bid => bid.status === 'active').length : 0), 0
  );
  const totalValue = skins.reduce((sum, skin) => sum + skin.price, 0);

  return (
    <div className={`App theme-${theme}`}>
      {/* Хедер */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <h1>🎯 CS2 SKIN MARKET</h1>
            <p>Торговая площадка скинов Counter-Strike 2</p>
          </div>
          
          <div className="header-controls">
            {/* Переключатель темы */}
            <div className="theme-toggle">
              <button 
                onClick={handleToggleTheme}
                className="theme-toggle-btn"
                title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
              >
                {theme === 'light' ? '🤓' : '😈'}
              </button>
            </div>

            {/* Выбор валюты */}
            <div className="currency-selector">
              <select 
                value={currency} 
                onChange={(e) => handleSetCurrency(e.target.value)}
                className="currency-select"
              >
                <option value="RUB">₽ RUB</option>
                <option value="USD">$ USD</option>
                <option value="BYN">BYN</option>
              </select>
            </div>

            {/* Кнопки авторизации */}
            <div className="auth-buttons">
              {isAuthenticated ? (
                <div className="user-menu">
                  <span className="user-greeting">Привет, {user.name}!</span>
                  <span className="user-balance-header">Баланс: {convertPrice(user.balance)}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    🚪 Выйти
                  </button>
                </div>
              ) : (
                <div className="auth-buttons-group">
                  <button 
                    onClick={() => dispatch(setAuthModal('login'))}
                    className="auth-btn login-btn"
                  >
                    🔐 Войти
                  </button>
                  <button 
                    onClick={() => dispatch(setAuthModal('register'))}
                    className="auth-btn register-btn"
                  >
                    🎯 Регистрация
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Остальной код без изменений */}
      {/* Поиск и фильтры */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-grid">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Поиск по названию или оружию..."
                value={searchTerm}
                onChange={(e) => handleSetSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="weapon-filter">
              <select 
                value={selectedWeapon} 
                onChange={(e) => handleSetSelectedWeapon(e.target.value)}
                className="weapon-select"
              >
                <option value="">Все оружия</option>
                {weapons.map(weapon => (
                  <option key={weapon} value={weapon}>{weapon}</option>
                ))}
              </select>
            </div>
            <div className="results-count">
              Найдено: {totalSkins} скинов • {totalBids} активных ставок
            </div>
          </div>
        </div>
      </section>

      {/* Основной контент */}
      <main className="main-content">
        <div className="container">
          <div className="content-grid">
            {/* Сайдбар с формой */}
            <aside className="sidebar">
              <Form 
                handleSubmit={editingSkin ? handleUpdateSkin : handleAddSkin}
                inSkin={editingSkin || {
                  name: "", 
                  weapon: "", 
                  quality: "Прямо с завода", 
                  float: 0.00, 
                  price: 0, 
                  imageUrl: "",
                  condition: "Прямо с завода",
                  sticker: "Нет стикеров",
                  statTrak: false,
                  description: "",
                  marketUrl: ""
                }}
                isEditing={!!editingSkin}
                onCancel={handleCancelEdit}
              />
            </aside>

            {/* Основная сетка скинов */}
            <section className="skins-section">
              <Table 
                skins={skins} 
                deleteSkin={handleDeleteSkin}
                editSkin={handleStartEdit}
                showSkinDetails={handleShowSkinDetails}
                onMakeBid={handleMakeBid}
              />
            </section>
          </div>
        </div>
      </main>

      {/* Модальные окна и футер остаются без изменений */}
      {/* ... остальной код модальных окон и футера ... */}

    </div>
  );
}

export default App;