import React from 'react';
import { Container, Grid, Box, Typography, Divider, Modal, Backdrop, Fade, Chip } from '@mui/material'; // Добавлены компоненты Modal
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import Form from '../Form'; 
import Table from '../Table';

import { 
  addSkin, 
  updateSkin, 
  deleteSkin, 
  setEditingSkin, 
  clearEditingSkin,
  setSelectedSkin,
  clearSelectedSkin // Добавлен экшен очистки
} from '../store/slices/skinsSlice';
import { setBidModalSkin, selectCurrency } from '../store/slices/uiSlice';
import { selectUser, selectIsAuthenticated } from '../store/slices/authSlice';

const MarketPage = () => {
  const dispatch = useAppDispatch();
  
  const skins = useAppSelector(state => state.skins?.items || []);
  const weaponDatabase = useAppSelector(state => state.weapons?.items || []);
  const selectedSkin = useAppSelector(state => state.skins?.selectedSkin || null); // Получаем выбранный скин
  const theme = useAppSelector(state => state.ui.theme);
  
  const user = selectUser(useAppSelector(state => state));
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const editingSkin = useAppSelector(state => state.skins?.editingSkin || null);
  const currency = useAppSelector(selectCurrency);

  const isDark = theme === 'dark';

  const topSkins = [...skins].sort((a, b) => b.price - a.price).slice(0, 5);

  const handleAddSkin = (newSkinData) => {
    let finalImageUrl = newSkinData.imageUrl;
    if (!finalImageUrl) {
      const foundInDb = weaponDatabase.find(w => w.name === newSkinData.weapon);
      if (foundInDb) finalImageUrl = foundInDb.imageUrl;
    }
    const skinWithImage = { ...newSkinData, id: Date.now(), imageUrl: finalImageUrl, ownerId: user?.id, createdAt: new Date().toISOString(), bids: [] };
    dispatch(addSkin(skinWithImage));
  };

  const handleDeleteSkin = (id) => { if (window.confirm('Удалить этот лот?')) dispatch(deleteSkin(id)); };
  const handleUpdateSkin = (updatedData) => { dispatch(updateSkin(updatedData)); dispatch(clearEditingSkin()); };
  const handleStartEdit = (skin) => { if (!isAuthenticated) return alert('Войдите!'); dispatch(setEditingSkin(skin)); };
  const handleCancelEdit = () => dispatch(clearEditingSkin());
  const handleShowSkinDetails = (skin) => dispatch(setSelectedSkin(skin));
  const handleMakeBid = (skin) => { if (!isAuthenticated) return alert('Войдите!'); dispatch(setBidModalSkin(skin)); };

  const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 500 }, bgcolor: isDark ? '#1a1a2e' : '#fff',
    border: `1px solid ${isDark ? '#4ecdc4' : '#eee'}`, boxShadow: 24, p: 4, borderRadius: '20px',
    color: isDark ? '#fff' : '#333', outline: 'none'
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 1, fontWeight: '900', color: '#fff' }}>CS2 MARKETPLACE</Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: '#4ecdc4' }}>Лучшие скины по лучшим ценам</Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Form 
              handleSubmit={editingSkin ? handleUpdateSkin : handleAddSkin}
              inSkin={editingSkin || { name: "", weapon: "", quality: "Прямо с завода", float: 0.0, price: 0, imageUrl: "", sticker: "Нет", statTrak: false, description: "" }}
              isEditing={!!editingSkin} onCancel={handleCancelEdit} user={user} isOwner={!editingSkin || (editingSkin.ownerId === user?.id)}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>🔥 Топ предложений</Typography>
          <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Table skins={topSkins} currency={currency} deleteSkin={handleDeleteSkin} editSkin={handleStartEdit} showSkinDetails={handleShowSkinDetails} onMakeBid={handleMakeBid} />
        </Grid>
      </Grid>

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
                  {selectedSkin.statTrak && <Chip label="StatTrak™" size="small" sx={{ bgcolor: '#cf6a32', color: '#fff', width: 'fit-content' }} />}
                  <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#eee' }} />
                  <Typography variant="subtitle2" color="textSecondary">Описание:</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{selectedSkin.description || "Описание не указано"}</Typography>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>Стикеры:</Typography>
                  <Typography variant="body2">{selectedSkin.sticker || "Нет стикеров"}</Typography>
                </Box>
                <button onClick={() => dispatch(clearSelectedSkin())} style={{ marginTop: '25px', width: '100%', padding: '12px', backgroundColor: '#4ecdc4', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Закрыть</button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default MarketPage;