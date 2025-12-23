import React from 'react';
import { Container, Grid, Box, Typography, Divider, Modal, Backdrop, Fade } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import Form from '../Form'; 
import Table from '../Table';
import { addSkin, updateSkin, deleteSkin, setEditingSkin, clearEditingSkin, setSelectedSkin, clearSelectedSkin } from '../store/slices/skinsSlice';
import { setBidModalSkin } from '../store/slices/uiSlice';
import { selectCurrency } from '../store/slices/currencySlice'; 
import { selectUser, selectIsAuthenticated } from '../store/slices/authSlice';

const MarketPage = () => {
  const dispatch = useAppDispatch();
  const skins = useAppSelector(state => state.skins?.items || []);
  const selectedSkin = useAppSelector(state => state.skins?.selectedSkin || null);
  const theme = useAppSelector(state => state.ui.theme);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const editingSkin = useAppSelector(state => state.skins?.editingSkin || null);
  const isDark = theme === 'dark';

  const safeRender = (v) => (v && typeof v === 'object' ? JSON.stringify(v) : String(v || ''));

  const topSkins = [...skins].sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 5);

  const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 500 }, 
    bgcolor: isDark ? '#110202' : '#fff', 
    border: `1px solid ${isDark ? 'var(--accent-primary)' : '#eee'}`, 
    boxShadow: 24, p: 4, borderRadius: '20px',
    color: isDark ? '#fff' : '#333', outline: 'none'
};

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ mb: 1, fontWeight: '900', color: isDark ? '#fff' : '#1a1a1a' }}>CS2 MARKETPLACE</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Form 
              handleSubmit={editingSkin ? (d) => dispatch(updateSkin(d)) : (d) => dispatch(addSkin({ skinData: d, user }))}
              inSkin={editingSkin} isEditing={!!editingSkin} onCancel={() => dispatch(clearEditingSkin())} user={user}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ color: isDark ? '#fff' : '#1a1a1a', mb: 2 }}>🔥 Топ предложений</Typography>
          <Divider sx={{ mb: 3 }} />
          <Table 
            skins={topSkins} 
            deleteSkin={(id) => window.confirm('Удалить?') && dispatch(deleteSkin(id))} 
            editSkin={(s) => dispatch(setEditingSkin(s))} 
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MarketPage;