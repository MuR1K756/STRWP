import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import { useAppDispatch } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Простая валидация
    if (formData.username.length < 3) {
      setError('Имя пользователя должно быть не короче 3 символов');
      return;
    }
    if (formData.password.length < 4) {
      setError('Пароль слишком короткий');
      return;
    }

    // Имитация входа (в реальном проекте тут будет dispatch(login(formData)))
    // Для теста просто перенаправляем в профиль
    navigate('/profile');
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Paper sx={{ p: 4, borderRadius: '16px' }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>🔐 Вход</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth label="Логин"
            margin="normal"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            error={!!error}
          />
          <TextField
            fullWidth label="Пароль"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            helperText={error}
            error={!!error}
          />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3, bgcolor: '#4ecdc4' }}>
            Войти
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;