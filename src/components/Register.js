import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { registerUser, selectAuthError } from '../store/slices/authSlice';

const Register = ({ onClose, switchToLogin }) => {
  const dispatch = useAppDispatch();
  const serverError = useAppSelector(selectAuthError); // Ошибка от сервера из Redux
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({}); // Состояние локальных ошибок
  const [isLoading, setIsLoading] = useState(false);

  // --- ФУНКЦИЯ ВАЛИДАЦИИ  ---
  const validateForm = () => {
    const newErrors = {};
    
    if (formData.username.length < 3) {
      newErrors.username = 'Имя пользователя должно быть от 3 символов';
    }
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Введите корректный Email адрес';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть минимум 6 символов';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Сначала проверяем локально
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Вызываем  authSlice (внутри Axios)
      await dispatch(registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      }));
      
      // Если ошибок в Redux нет, закрываем окно
      if (!serverError) {
        onClose();
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Убираем ошибку поля, когда пользователь начинает его исправлять
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  // Вспомогательный стиль для красных полей
  const getInputStyle = (fieldName) => ({
    border: errors[fieldName] ? '2px solid #ff4444' : '1px solid var(--border-color)',
    backgroundColor: errors[fieldName] ? 'rgba(255, 68, 68, 0.05)' : 'inherit'
  });

  return (
    <div className="auth-modal">
      <div className="auth-header">
        <h2>🎯 Регистрация</h2>
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
          <label>Имя пользователя:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="username"
            disabled={isLoading}
            style={getInputStyle('username')}
          />
          {errors.username && <span className="error-text" style={{color: '#ff4444', fontSize: '12px'}}>{errors.username}</span>}
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            disabled={isLoading}
            style={getInputStyle('email')}
          />
          {errors.email && <span className="error-text" style={{color: '#ff4444', fontSize: '12px'}}>{errors.email}</span>}
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
            style={getInputStyle('password')}
          />
          {errors.password && <span className="error-text" style={{color: '#ff4444', fontSize: '12px'}}>{errors.password}</span>}
        </div>
        
        <div className="form-group">
          <label>Подтвердите пароль:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isLoading}
            style={getInputStyle('confirmPassword')}
          />
          {errors.confirmPassword && <span className="error-text" style={{color: '#ff4444', fontSize: '12px'}}>{errors.confirmPassword}</span>}
        </div>

        {/* Вывод ошибки от сервера, если она пришла */}
        {serverError && <div className="server-error" style={{color: '#ff4444', textAlign: 'center', marginBottom: '10px', fontWeight: 'bold'}}>{serverError}</div>}
        
        <button 
          type="submit" 
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Регистрация...' : '🎯 Создать аккаунт'}
        </button>
        
        <div className="auth-switch">
          <span>Уже есть аккаунт? </span>
          <button 
            type="button" 
            onClick={switchToLogin} 
            className="switch-btn"
            disabled={isLoading}
          >
            Войти
          </button>
        </div>

        <div className="auth-benefits">
          <h4>🎁 Что вы получаете:</h4>
          <ul>
            <li>💼 Стартовый баланс: 10,000 ₽</li>
            <li>💎 Возможность делать ставки</li>
            <li>📊 Отслеживание своих ставок</li>
            <li>⭐ Приоритет в уведомлениях</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default Register;