import './App.css';
import Table from "./Table";
import Form from "./Form";
import { useState, useEffect } from "react";
import { useAuth } from './AuthContext'; // Изменен путь
import { useCurrency } from './CurrencyContext'; // Изменен путь

// Класс для работы со скинами CS2 (остается без изменений)
class SkinAPI {
  constructor() {
    this.skins = JSON.parse(localStorage.getItem('cs2SkinsMarketplace')) || [
      {
        id: 1,
        name: "AK-47 | Красная линия",
        weapon: "AK-47",
        quality: "Прямо с завода",
        float: 0.15,
        price: 8500,
        imageUrl: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdD1965O0q4yZqPv9NLPF2G5U18l4j_vM8oWg0Qew_BJvYzv7J4WUJw45ZFzV_1G_xr-7g8C76Z_JziU1uHIl4X2OylXp1u9POTI/360fx360f",
        condition: "Полевое испытание",
        sticker: "4x Starladder 2019",
        statTrak: false,
        description: "Легендарный AK-47 с уникальным красным дизайном",
        marketUrl: "https://steamcommunity.com/market/listings/730/AK-47%20%7C%20Redline%20%28Field-Tested%29"
      },
      {
        id: 2,
        name: "AWP | Дракон Лора",
        weapon: "AWP",
        quality: "Немного поношенное",
        float: 0.25,
        price: 12500,
        imageUrl: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdD1965O0q4yZqPv9NLPF2G5U18l4j_vM8oWg0Qew_BJvYzv7J4WUJw45ZFzV_1G_xr-7g8C76Z_JziU1uHIl4X2OylXp1u9POTI/360fx360f",
        condition: "После полевых испытаний",
        sticker: "1x Crown Foil",
        statTrak: true,
        description: "Самая желанная AWP в игре с драконом",
        marketUrl: "https://steamcommunity.com/market/listings/730/AWP%20%7C%20Dragon%20Lore%20%28Factory%20New%29"
      }
    ];
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('cs2SkinsMarketplace', JSON.stringify(this.skins));
  }

  all() {
    return this.skins;
  }

  add(skin) {
    const newSkin = {
      ...skin,
      id: Date.now(),
      price: parseInt(skin.price) || 0,
      float: parseFloat(skin.float) || 0
    };
    this.skins.push(newSkin);
    this.saveToStorage();
    return newSkin;
  }

  update(skin) {
    const index = this.skins.findIndex(s => s.id === skin.id);
    if (index !== -1) {
      this.skins[index] = {
        ...skin,
        price: parseInt(skin.price) || 0,
        float: parseFloat(skin.float) || 0
      };
      this.saveToStorage();
      return this.skins[index];
    }
    return null;
  }

  delete(id) {
    const initialLength = this.skins.length;
    this.skins = this.skins.filter(skin => skin.id !== id);
    this.saveToStorage();
    return this.skins.length !== initialLength;
  }

  find(id) {
    return this.skins.find(skin => skin.id === id);
  }
}

const skinAPI = new SkinAPI();
const initialSkins = skinAPI.all();

function App() {
  const [skins, setSkins] = useState(initialSkins);
  const [editingSkin, setEditingSkin] = useState(null);
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const [authModal, setAuthModal] = useState(null); // 'login', 'register', null
  const { user, isAuthenticated, logout } = useAuth();
  const { currency, setCurrency, convertPrice } = useCurrency();

  const deleteSkin = (id) => {
    if (skinAPI.delete(id)) {
      setSkins(skins.filter((skin) => skin.id !== id));
    }
  };

  const addSkin = (skin) => {
    const newSkin = skinAPI.add(skin);
    if(newSkin) {
      setSkins([...skins, newSkin]);
    }
  };

  const updateSkin = (skin) => {
    const updatedSkin = skinAPI.update(skin);
    if(updatedSkin) {
      setSkins(skins.map(s => s.id === skin.id ? updatedSkin : s));
      setEditingSkin(null);
    }
  };

  const startEdit = (skin) => {
    if (!isAuthenticated) {
      setAuthModal('login');
      return;
    }
    setEditingSkin(skin);
  };

  const cancelEdit = () => {
    setEditingSkin(null);
  };

  const showSkinDetails = (skin) => {
    setSelectedSkin(skin);
  };

  const closeSkinDetails = () => {
    setSelectedSkin(null);
  };

  const handleMakeBid = (skin) => {
    if (!isAuthenticated) {
      setAuthModal('login');
      return;
    }
    alert(`Ставка на скин ${skin.name} принята!`);
  };

  // Фильтрация скинов
  const filteredSkins = skins.filter(skin => {
    const matchesSearch = skin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skin.weapon.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWeapon = !selectedWeapon || skin.weapon === selectedWeapon;
    return matchesSearch && matchesWeapon;
  });

  const weapons = [...new Set(skins.map(skin => skin.weapon))];

  return (
    <div className="App">
      {/* Хедер */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <h1>🎯 CS2 SKIN MARKET</h1>
            <p>Торговая площадка скинов Counter-Strike 2</p>
          </div>
          
          <div className="header-controls">
            {/* Выбор валюты */}
            <div className="currency-selector">
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
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
                  <button onClick={logout} className="logout-btn">
                    🚪 Выйти
                  </button>
                </div>
              ) : (
                <div className="auth-buttons-group">
                  <button 
                    onClick={() => setAuthModal('login')}
                    className="auth-btn login-btn"
                  >
                    🔐 Войти
                  </button>
                  <button 
                    onClick={() => setAuthModal('register')}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="weapon-filter">
              <select 
                value={selectedWeapon} 
                onChange={(e) => setSelectedWeapon(e.target.value)}
                className="weapon-select"
              >
                <option value="">Все оружия</option>
                {weapons.map(weapon => (
                  <option key={weapon} value={weapon}>{weapon}</option>
                ))}
              </select>
            </div>
            <div className="results-count">
              Найдено: {filteredSkins.length} скинов
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
                handleSubmit={editingSkin ? updateSkin : addSkin}
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
                onCancel={cancelEdit}
              />
            </aside>

            {/* Основная сетка скинов */}
            <section className="skins-section">
              <Table 
                skins={filteredSkins} 
                deleteSkin={deleteSkin}
                editSkin={startEdit}
                showSkinDetails={showSkinDetails}
                onMakeBid={handleMakeBid}
              />
            </section>
          </div>
        </div>
      </main>

      {/* Модальное окно с деталями скина */}
      {selectedSkin && (
        <div className="modal-overlay" onClick={closeSkinDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeSkinDetails}>×</button>
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
                </div>
                <a 
                  href={selectedSkin.marketUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="market-link"
                >
                  📊 Открыть в Steam Market
                </a>
              </div>
              
              <div className="skin-info-section">
                <h2>{selectedSkin.name}</h2>
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
                    <span className="price-label">Цена:</span>
                    <span className="price-amount">{convertPrice(selectedSkin.price)}</span>
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
                          setAuthModal('login');
                          return;
                        }
                        setEditingSkin(selectedSkin);
                        closeSkinDetails();
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

      {/* Модальное окно авторизации */}
      {authModal && (
        <div className="modal-overlay" onClick={() => setAuthModal(null)}>
          <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
            {authModal === 'login' ? (
              <Login 
                onClose={() => setAuthModal(null)}
                switchToRegister={() => setAuthModal('register')}
              />
            ) : (
              <Register 
                onClose={() => setAuthModal(null)}
                switchToLogin={() => setAuthModal('login')}
              />
            )}
          </div>
        </div>
      )}

      {/* Футер */}
      <footer className="app-footer">
        <div className="container">
          <p>CS2 Skin Market &copy; 2024 - Торговая площадка скинов Counter-Strike 2</p>
          <div className="currency-info">
            <small>Курсы валют: 1 RUB = 0.011 USD = 0.036 BYN</small>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;