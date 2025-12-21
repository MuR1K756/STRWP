import './styles/App.css';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Компоненты Layout и страниц
import Layout from './components/Layout';
import MarketPage from './pages/MarketPage';
import KnivesPage from './pages/KnivesPage';
import PistolsPage from './pages/PistolsPage';
import RiflesPage from './pages/RiflesPage';
import SMGsPage from './pages/SMGsPage';
import HeavyPage from './pages/HeavyPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WeaponDetailsPage from './pages/WeaponDetailsPage';

// Модальные окна
import BidModal from './components/BidModal';
import Login from './components/Login';
import Register from './components/Register';

// Импорты из Redux slices
import { selectTheme, setBidModalSkin, setAuthModal } from './store/slices/uiSlice';

function App() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectTheme);
  
  const bidModalSkin = useAppSelector(state => state.ui.bidModalSkin);
  const authModal = useAppSelector(state => state.ui.authModal);

  // Настройка темы MUI
  const muiTheme = createTheme({
    palette: {
      mode: themeMode === 'dark' ? 'dark' : 'light',
      primary: { main: themeMode === 'dark' ? '#b01b2e' : '#800020' }, // Изменил на бордовый
      secondary: { main: '#b01b2e' },
      background: {
        // ИСПРАВЛЕНО: Убираем синий #0f0f1a и #1a1a2e
        default: themeMode === 'dark' ? '#050505' : '#f8f9fa', 
        paper: themeMode === 'dark' ? '#110202' : '#ffffff', 
      },
      text: {
        primary: themeMode === 'dark' ? '#ffffff' : '#2d3748',
      }
    },
    typography: { fontFamily: '"Segoe UI", Tahoma, sans-serif' },
    shape: { borderRadius: 12 },
  });

  // Глобальные стили темы
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    // ИСПРАВЛЕНО: Чтобы фон страницы тоже не был синим
    document.body.style.backgroundColor = themeMode === 'dark' ? '#050505' : '#f8f9fa';
  }, [themeMode]);

  // --- ЛОГИКА СТАВОК ---
  const handleMakeBid = (skinId, amount) => {
    // Здесь будет запрос к API
    console.log(`Создание ставки: ID скина ${skinId}, Сумма: ${amount}`);
    // После успешного ответа сервера обычно закрываем модалку:
    dispatch(setBidModalSkin(null));
    alert('Ставка успешно принята!');
  };

  const handleCancelBid = (skinId, bidId) => {
    // Здесь будет запрос к API на удаление ставки
    console.log(`Отмена ставки: ID ставки ${bidId} на скине ${skinId}`);
    // dispatch(setBidModalSkin(null)); // Опционально закрывать при отмене
    alert('Ставка отменена');
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <div className={`app-container theme-${themeMode}`}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<MarketPage />} />
              <Route path="knives" element={<KnivesPage />} />
              <Route path="pistols" element={<PistolsPage />} />
              <Route path="rifles" element={<RiflesPage />} />
              <Route path="smgs" element={<SMGsPage />} />
              <Route path="heavy" element={<HeavyPage />} />
              
              {/* ИСПРАВЛЕНО: универсальный путь для деталей оружия по ID */}
              <Route path="/weapon/:weaponName" element={<WeaponDetailsPage />} />
              
              <Route path="profile" element={<ProfilePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
          </Routes>

          {/* Глобальные модальные окна */}
          {bidModalSkin && (
            <div className="modal-overlay" onClick={() => dispatch(setBidModalSkin(null))}>
              {/* Исправлено: класс modal-content для соответствия твоему CSS */}
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <BidModal 
                  skin={bidModalSkin}
                  onClose={() => dispatch(setBidModalSkin(null))}
                  onMakeBid={handleMakeBid}
                  onCancelBid={handleCancelBid} // ДОБАВЛЕНО
                />
              </div>
            </div>
          )}

          {authModal && (
            <div className="modal-overlay" onClick={() => dispatch(setAuthModal(null))}>
              <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
                {authModal === 'login' ? (
                  <Login 
                    onClose={() => dispatch(setAuthModal(null))}
                    switchToRegister={() => dispatch(setAuthModal('register'))}
                  />
                ) : (
                  <Register 
                    onClose={() => dispatch(setAuthModal(null))}
                    switchToLogin={() => dispatch(setAuthModal('login'))}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;