import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

const Register = ({ onClose, switchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }
    
    // В реальном приложении здесь был бы запрос к API
    register({
      id: Date.now(),
      username: formData.username,
      email: formData.email,
      name: formData.username,
      avatar: '👤',
      joinDate: new Date().toISOString()
    });
    onClose();
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
        <button className="close-auth" onClick={onClose}>×</button>
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
          />
        </div>
        
        <button type="submit" className="auth-submit-btn">
          🎯 Создать аккаунт
        </button>
        
        <div className="auth-switch">
          <span>Уже есть аккаунт? </span>
          <button type="button" onClick={switchToLogin} className="switch-btn">
            Войти
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;