import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { loginSuccess } from '../store/slices/authSlice';

const Login = ({ onClose, switchToRegister }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Демо-авторизация
      dispatch(loginSuccess({
        id: Date.now(),
        email: formData.email,
        name: formData.email.split('@')[0],
        avatar: '👤',
        balance: 10000,
        joinDate: new Date().toISOString()
      }));
      
      onClose();
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      alert('Ошибка авторизации. Проверьте email и пароль.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDemoLogin = () => {
    // Быстрый вход с демо-данными
    dispatch(loginSuccess({
      id: 1,
      email: 'demo@example.com',
      name: 'DemoUser',
      avatar: '🎮',
      balance: 15000,
      joinDate: new Date().toISOString()
    }));
    onClose();
  };

  return (
    <div className="auth-modal">
      <div className="auth-header">
        <h2>🔐 Вход в аккаунт</h2>
        <button 
          className="close-auth" 
          onClick={onClose}
          disabled={isLoading}
        >
          ×
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Вход...' : '🚀 Войти'}
        </button>

        {/* Демо-кнопка для быстрого тестирования */}
        <button 
          type="button" 
          className="demo-login-btn"
          onClick={handleDemoLogin}
          disabled={isLoading}
        >
          🎮 Быстрый демо-вход
        </button>
        
        <div className="auth-switch">
          <span>Нет аккаунта? </span>
          <button 
            type="button" 
            onClick={switchToRegister} 
            className="switch-btn"
            disabled={isLoading}
          >
            Зарегистрироваться
          </button>
        </div>

        <div className="auth-info">
          <small>
            💡 Демо-режим: используйте любые данные или нажмите "Быстрый демо-вход"
          </small>
        </div>
      </form>
    </div>
  );
};

export default Login;