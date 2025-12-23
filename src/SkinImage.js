import React from 'react';

const SkinImage = ({ skin, className, onClick }) => {
  const { image, weapon, name, statTrak } = skin;

  const getWeaponColor = (weapon) => {
    const colors = {
      'AK-47': '#e74c3c',
      'AWP': '#3498db', 
      'M4A4': '#2ecc71',
      'M4A1-S': '#9b59b6',
      'Desert Eagle': '#f39c12',
      'Glock-18': '#1abc9c',
      'USP-S': '#34495e',
      'P2000': '#95a5a6',
      'P250': '#d35400',
      'Tec-9': '#c0392b',
      'Five-SeveN': '#8e44ad',
      'CZ75-Auto': '#16a085',
      'R8 Revolver': '#7f8c8d',
      'Nova': '#27ae60',
      'XM1014': '#2980b9',
      'MAG-7': '#e67e22',
      'Sawed-Off': '#e74c3c',
      'M249': '#2c3e50',
      'Negev': '#f1c40f'
    };
    return colors[weapon] || '#b01b2e';
  };

  if (image) {
    return (
      <div className={`skin-image ${className || ''}`} onClick={onClick}>
        <img src={image} alt={name} />
        {statTrak && <div className="stattrak-indicator">ST</div>}
        {onClick && (
          <div className="skin-overlay">
            <span>Посмотреть детали</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`skin-image placeholder ${className || ''}`} 
      onClick={onClick}
      style={{ 
  background: `linear-gradient(135deg, ${getWeaponColor(weapon)}22 0%, #0a0a0a 100%)`,
  border: `1px solid ${getWeaponColor(weapon)}44` // Добавим легкое свечение в цвет пушки
}}
    >
      <div className="skin-placeholder-content">
        <div className="weapon-name">{weapon}</div>
        <div className="skin-name">{name.split('|')[1]?.trim() || name}</div>
      </div>
      {statTrak && <div className="stattrak-indicator">ST</div>}
      {onClick && (
        <div className="skin-overlay">
          <span>Посмотреть детали</span>
        </div>
      )}
    </div>
  );
};

export default SkinImage;