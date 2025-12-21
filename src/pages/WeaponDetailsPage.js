import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import Table from '../Table'; 
import { Container, Typography, Breadcrumbs, Box, Modal, Backdrop, Fade, Divider, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

import { deleteSkin, setEditingSkin, setSelectedSkin, clearSelectedSkin } from '../store/slices/skinsSlice';
import { setBidModalSkin } from '../store/slices/uiSlice';

const WeaponDetailsPage = () => {
  const params = useParams();
  const rawName = params.weaponName || params.id || "";
  const dispatch = useAppDispatch();
  
  const decodedName = rawName ? decodeURIComponent(rawName).trim() : "Неизвестное оружие";
  const allSkins = useAppSelector(state => state.skins.items || []);
  const selectedSkin = useAppSelector(state => state.skins?.selectedSkin || null);
  const theme = useAppSelector(state => state.ui.theme);
  const isDark = theme === 'dark';

  const weaponSkins = allSkins.filter(skin => {
    if (!skin.weapon) return false;
    return skin.weapon.trim().toLowerCase() === decodedName.toLowerCase();
  });

  const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 500 }, bgcolor: isDark ? '#1a1a2e' : '#fff',
    border: `1px solid ${isDark ? '#4ecdc4' : '#eee'}`, boxShadow: 24, p: 4, borderRadius: '20px',
    color: isDark ? '#fff' : '#333', outline: 'none'
  };

  if (!rawName) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/" style={{ color: '#4ecdc4', textDecoration: 'none' }}>Главная</Link>
        <Typography sx={{ color: '#fff' }}>{decodedName}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>{decodedName}</Typography>
        <Typography variant="h6" sx={{ color: '#4ecdc4' }}>({weaponSkins.length} предложений)</Typography>
      </Box>

      {weaponSkins.length > 0 ? (
        <Table 
          skins={weaponSkins} 
          deleteSkin={(id) => window.confirm('Удалить?') && dispatch(deleteSkin(id))} 
          editSkin={(skin) => dispatch(setEditingSkin(skin))} 
          showSkinDetails={(skin) => dispatch(setSelectedSkin(skin))} 
          onMakeBid={(skin) => dispatch(setBidModalSkin(skin))} 
        />
      ) : (
        <Box sx={{ textAlign: 'center', py: 10, background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
          <Typography sx={{ color: '#666' }}>На данный момент скинов для <b>{decodedName}</b> в продаже нет.</Typography>
        </Box>
      )}

      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ */}
      <Modal open={!!selectedSkin} onClose={() => dispatch(clearSelectedSkin())} closeAfterTransition slots={{ backdrop: Backdrop }}>
        <Fade in={!!selectedSkin}>
          <Box sx={modalStyle}>
            {selectedSkin && (
              <>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>{selectedSkin.name}</Typography>
                <Box sx={{ textAlign: 'center', mb: 3, p: 2, background: isDark ? '#0f0f1a' : '#f5f5f5', borderRadius: '15px' }}>
                  <img src={selectedSkin.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="textSecondary">Оружие:</Typography><Typography fontWeight="600">{selectedSkin.weapon}</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="textSecondary">Качество:</Typography><Typography sx={{ color: '#4ecdc4' }}>{selectedSkin.quality}</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="textSecondary">Float:</Typography><Typography>{selectedSkin.float || '0.00'}</Typography></Box>
                  <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#eee' }} />
                  <Typography variant="subtitle2" color="textSecondary">Описание:</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{selectedSkin.description || "Описание не указано"}</Typography>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>Стикеры:</Typography>
                  <Typography variant="body2">{selectedSkin.sticker || "Нет"}</Typography>
                </Box>
                <button 
                  onClick={() => dispatch(clearSelectedSkin())} 
                  style={{ marginTop: '25px', width: '100%', padding: '12px', backgroundColor: '#4ecdc4', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Закрыть
                </button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default WeaponDetailsPage;