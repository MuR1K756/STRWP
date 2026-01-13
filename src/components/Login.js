import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, loginSuccess, selectAuthError } from '../store/slices/authSlice';

const Login = ({ onClose, switchToRegister }) => {
  const dispatch = useAppDispatch();
  const serverError = useAppSelector(selectAuthError); // Берем ошибку из стора (если сервер ответил 401 или 404)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({}); // Состояние для локальной валидации
  const [isLoading, setIsLoading] = useState(false);

  // --- ЛОГИКА КЛИЕНТСКОЙ ВАЛИДАЦИИ  ---
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.includes('@')) {
      newErrors.email = 'Некорректный формат Email';
    }
    if (formData.password.length < 4) {
      newErrors.password = 'Пароль слишком короткий';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Сначала проверяем на фронте
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      //  Axios

      await dispatch(loginUser(formData));
      
      // Если запрос прошел и в сторе нет ошибки — закрываем модалку
      // В authSlice при успехе ставится loading: false и error: null
      if (!serverError) {
        onClose();
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Подчищаем ошибку поля при вводе
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleDemoLogin = () => {
    // Оставляем твой быстрый вход для тестов
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

  // Стиль для инпутов с ошибкой
  const inputStyle = (fieldName) => ({
    border: errors[fieldName] ? '2px solid #ff4444' : '1px solid var(--border-color)',
    transition: 'border 0.2s ease'
  });

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
            placeholder="your@email.com"
            disabled={isLoading}
            style={inputStyle('email')}
          />
          {errors.email && <span style={{color: '#ff4444', fontSize: '12px', marginTop: '4px'}}>{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isLoading}
            style={inputStyle('password')}
          />
          {errors.password && <span style={{color: '#ff4444', fontSize: '12px', marginTop: '4px'}}>{errors.password}</span>}
        </div>

        {/* Если сервер вернул ошибку (например, "Неверный пароль") */}
        {serverError && (
          <div style={{
            background: 'rgba(255, 68, 68, 0.1)',
            color: '#ff4444',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '15px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {serverError}
          </div>
        )}
        
        <button 
          type="submit" 
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Вход...' : '🚀 Войти'}
        </button>

        <button 
          type="button" 
          className="demo-login-btn"
          onClick={handleDemoLogin}
          disabled={isLoading}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '12px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
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