import React from 'react';
import { Container, Typography, Paper, Box, Avatar, Grid, Divider } from '@mui/material';
import { useAppSelector } from '../hooks/redux';
import { selectUser, selectIsAuthenticated } from '../store/slices/authSlice';
import { selectAllSkins } from '../store/slices/skinsSlice';

const ProfilePage = () => {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const allSkins = useAppSelector(selectAllSkins);

  // Фильтруем скины, которые принадлежат этому пользователю
  const mySkins = allSkins.filter(skin => skin.ownerId === user?.id);

  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="error">❌ Доступ запрещен. Пожалуйста, войдите в систему.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(26, 26, 46, 0.8)', color: '#fff', borderRadius: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          {/* ИСПРАВЛЕНО: Безопасный доступ к первой букве */}
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#4ecdc4', fontSize: '2rem', mr: 3 }}>
            {user?.username ? user.username[0].toUpperCase() : '?'}
          </Avatar>
          <Box>
            <Typography variant="h4">{user?.username || 'Пользователь'}</Typography>
            <Typography variant="body1" color="gray">{user?.email}</Typography>
          </Box>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center' }}>
              <Typography variant="h6" color="#4ecdc4">{mySkins.length}</Typography>
              <Typography variant="body2">Моих скинов в продаже</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center' }}>
              <Typography variant="h6" color="#4ecdc4">
                {allSkins.reduce((acc, skin) => acc + (skin.bids?.filter(b => b.userId === user?.id).length || 0), 0)}
              </Typography>
              <Typography variant="body2">Активных ставок</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;