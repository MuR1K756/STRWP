import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

const Login = ({ onClose, switchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // В реальном приложении здесь был бы запрос к API
    login({
      id: 1,
      email: formData.email,
      name: formData.email.split('@')[0],
      avatar: '👤'
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
        <h2>🔐 Вход в аккаунт</h2>
        <button className="close-auth" onClick={onClose}>×</button>
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
          />
        </div>
        
        <button type="submit" className="auth-submit-btn">
          🚀 Войти
        </button>
        
        <div className="auth-switch">
          <span>Нет аккаунта? </span>
          <button type="button" onClick={switchToRegister} className="switch-btn">
            Зарегистрироваться
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;