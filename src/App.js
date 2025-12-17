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
  const theme = useAppSelector(selectTheme);

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

  // Переключение темы
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
    sticker: "Нет стикеров",
    statTrak: false,
    description: ""
  }}
  isEditing={!!editingSkin}
  onCancel={handleCancelEdit}
  user={user} // Добавляем пользователя
  isOwner={!editingSkin || (editingSkin.ownerId === user?.id)} // Проверяем владельца
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

      {/* Модальное окно с деталями скина */}
      {selectedSkin && (
        <div className="modal-overlay" onClick={handleCloseSkinDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseSkinDetails}>×</button>
            <div className="skin-details">
              <div className="skin-image-section">
                <div className="skin-image-container">
                  <img 
                    src={selectedSkin.imageUrl} 
                    alt={selectedSkin.name}
                    className="skin-detail-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300/1a1a2e/4ecdc4?text=Изображение+не+загружено';
                    }}
                  />
                  {selectedSkin.statTrak && <div className="stattrak-badge-large">StatTrak™</div>}
                  {selectedSkin.bids && selectedSkin.bids.filter(bid => bid.status === 'active').length > 0 && (
                    <div className="bids-count-badge">
                      💎 {selectedSkin.bids.filter(bid => bid.status === 'active').length} ставок
                    </div>
                  )}
                </div>
              </div>
              
              <div className="skin-info-section">
                <h2>{selectedSkin.name}</h2>
                
                {selectedSkin.bids && selectedSkin.bids.filter(bid => bid.status === 'active').length > 0 && (
                  <div className="bids-preview">
                    <h4>📊 Текущие ставки:</h4>
                    <div className="bids-preview-list">
                      {selectedSkin.bids
                        .filter(bid => bid.status === 'active')
                        .sort((a, b) => b.amount - a.amount)
                        .slice(0, 3)
                        .map((bid, index) => (
                          <div key={bid.id} className={`bid-preview-item ${bid.userId === user?.id ? 'my-bid-preview' : ''}`}>
                            <span className="bid-preview-user">
                              {index === 0 ? '👑 ' : ''}{bid.userName}
                            </span>
                            <span className="bid-preview-amount">{convertPrice(bid.amount)}</span>
                          </div>
                        ))
                      }
                      {selectedSkin.bids.filter(bid => bid.status === 'active').length > 3 && (
                        <div className="more-bids">
                          + еще {selectedSkin.bids.filter(bid => bid.status === 'active').length - 3} ставок
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="skin-specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Оружие:</span>
                    <span className="spec-value">{selectedSkin.weapon}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Качество:</span>
                    <span className="spec-value">{selectedSkin.quality}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Состояние:</span>
                    <span className={`spec-value condition ${selectedSkin.condition.replace(/\s+/g, '-').toLowerCase()}`}>
                      {selectedSkin.condition}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Float:</span>
                    <span className="spec-value">{selectedSkin.float}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Стикеры:</span>
                    <span className="spec-value">{selectedSkin.sticker}</span>
                  </div>
                  <div className="spec-item full-width">
                    <span className="spec-label">Описание:</span>
                    <span className="spec-value description">{selectedSkin.description}</span>
                  </div>
                </div>
                
                <div className="price-action-section">
                  <div className="price-display">
                    <span className="price-label">
                      {selectedSkin.bids && selectedSkin.bids.filter(bid => bid.status === 'active').length > 0 ? 'Текущая ставка:' : 'Цена:'}
                    </span>
                    <span className="price-amount">
                      {selectedSkin.bids && selectedSkin.bids.filter(bid => bid.status === 'active').length > 0 
                        ? convertPrice(Math.max(...selectedSkin.bids.filter(bid => bid.status === 'active').map(bid => bid.amount)))
                        : convertPrice(selectedSkin.price)
                      }
                    </span>
                  </div>
                  <div className="action-buttons">
                    <button 
                      className="buy-button"
                      onClick={() => handleMakeBid(selectedSkin)}
                    >
                      💎 Сделать ставку
                    </button>
                    <button 
                      className="edit-in-modal-button"
                      onClick={() => {
                        if (!isAuthenticated) {
                          dispatch(setAuthModal('login'));
                          return;
                        }
                        dispatch(setEditingSkin(selectedSkin));
                        handleCloseSkinDetails();
                      }}
                    >
                      ✏️ Редактировать
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно ставок */}
      {bidModalSkin && (
        <div className="modal-overlay" onClick={handleCloseBidModal}>
          <div className="modal-content bid-modal-content" onClick={(e) => e.stopPropagation()}>
            <BidModal 
              skin={bidModalSkin}
              onClose={handleCloseBidModal}
              onMakeBid={handleSubmitBid}
              onCancelBid={handleCancelBid}
            />
          </div>
        </div>
      )}

      {/* Модальное окно авторизации */}
      {authModal && (
        <div className="modal-overlay" onClick={handleCloseAuthModal}>
          <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
            {authModal === 'login' ? (
              <Login 
                onClose={handleCloseAuthModal}
                switchToRegister={() => dispatch(setAuthModal('register'))}
              />
            ) : (
              <Register 
                onClose={handleCloseAuthModal}
                switchToLogin={() => dispatch(setAuthModal('login'))}
              />
            )}
          </div>
        </div>
      )}

      {/* Футер */}
      <footer className="app-footer">
        <div className="container">
          <p>CS2 Skin Market &copy; 2024 - Торговая площадка скинов Counter-Strike 2</p>
          <div className="footer-stats">
            <span>Скинов: {totalSkins}</span>
            <span>Ставок: {totalBids}</span>
            <span>Общая стоимость: {convertPrice(totalValue)}</span>
          </div>
          <div className="currency-info">
            <small>Курсы валют: 1 RUB = 0.011 USD = 0.036 BYN</small>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;