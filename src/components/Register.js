import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { registerSuccess } from '../store/slices/authSlice';

const Register = ({ onClose, switchToLogin }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('❌ Пароли не совпадают!');
      return;
    }

    if (formData.password.length < 6) {
      alert('❌ Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // В реальном приложении здесь был бы запрос к API
      // const response = await api.register(formData);
      
      // Демо-регистрация
      dispatch(registerSuccess({
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        name: formData.username,
        avatar: '👤',
        balance: 10000,
        joinDate: new Date().toISOString()
      }));
      
      onClose();
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      alert('Ошибка регистрации. Попробуйте другой email или имя пользователя.');
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
            required
            placeholder="username"
            disabled={isLoading}
            minLength="3"
          />
        </div>
        
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
            minLength="6"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label>Подтвердите пароль:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
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