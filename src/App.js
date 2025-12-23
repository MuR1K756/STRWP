import './styles/App.css';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Компоненты
import Layout from './components/Layout';
import MarketPage from './pages/MarketPage';
import ProfilePage from './pages/ProfilePage';
import WeaponDetailsPage from './pages/WeaponDetailsPage'; // Это наше окно просмотра
import CategoryPage from './pages/CategoryPage';
import BidModal from './components/BidModal';
import Login from './components/Login';
import Register from './components/Register';

// Слайсы
import { selectTheme, setBidModalSkin, setAuthModal } from './store/slices/uiSlice';
import { addBid } from './store/slices/skinsSlice'; 

function App() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectTheme);
  
  const bidModalSkin = useAppSelector(state => state.ui.bidModalSkin);
  const authModal = useAppSelector(state => state.ui.authModal);
  const currentUser = useAppSelector(state => state.auth.user);

  const muiTheme = createTheme({
    palette: {
      mode: themeMode === 'dark' ? 'dark' : 'light',
      primary: { main: '#b01b2e' },
      background: {
        default: themeMode === 'dark' ? '#050505' : '#f8f9fa', 
        paper: themeMode === 'dark' ? '#110202' : '#ffffff', 
      }
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const handleMakeBid = (skinId, amount) => {
    if (!currentUser) {
      alert("Пожалуйста, войдите в аккаунт");
      return;
    }

    const bidData = {
      userId: currentUser.id,
      userName: currentUser.username || currentUser.email,
      amount: Number(amount),
      timestamp: new Date().toISOString()
    };

    dispatch(addBid({ skinId, bidData }));
    dispatch(setBidModalSkin(null));
  };

  const handleCancelBid = (skinId, bidId) => {
    console.log(`Отмена ставки: ${bidId}`);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <div className={`app-container theme-${themeMode}`}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<MarketPage />} />
              <Route path="knives" element={<CategoryPage type="knives" title="Ножи" icon="🔪" />} />
              <Route path="pistols" element={<CategoryPage type="pistols" title="Пистолеты" icon="🔫" />} />
              <Route path="rifles" element={<CategoryPage type="rifles" title="Винтовки" icon="🎯" />} />
              <Route path="smgs" element={<CategoryPage type="smgs" title="ПП" icon="⚡" />} />
              <Route path="heavy" element={<CategoryPage type="heavy" title="Тяжелое" icon="💣" />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>

          {/* ОКНО ПРОСМОТРА (Глазик) */}
          <WeaponDetailsPage />

          {/* МОДАЛКА СТАВКИ */}
          {bidModalSkin && (
            <div className="modal-overlay" onClick={() => dispatch(setBidModalSkin(null))}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <BidModal 
                  skin={bidModalSkin}
                  onClose={() => dispatch(setBidModalSkin(null))}
                  onMakeBid={handleMakeBid}
                  onCancelBid={handleCancelBid} 
                />
              </div>
            </div>
          )}

          {/* МОДАЛКИ ВХОДА/РЕГИСТРАЦИИ */}
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