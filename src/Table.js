import React, { useState } from "react";
import { useCurrency } from './CurrencyContext'; // Изменен путь импорта

const Table = ({ skins, deleteSkin, editSkin, showSkinDetails, onMakeBid }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' или 'table'
  const { convertPrice } = useCurrency();

  if (!skins || skins.length === 0) {
    return (
      <div className="no-skins">
        <div className="no-skins-icon">🎮</div>
        <h3>Скины не найдены</h3>
        <p>Добавьте первый скин на площадку!</p>
      </div>
    );
  }

  // Статистика
  const totalSkins = skins.length;
  const statTrakCount = skins.filter(s => s.statTrak).length;
  const totalValue = skins.reduce((sum, skin) => sum + skin.price, 0);

  return (
    <div className="hybrid-container">
      {/* Хедер с переключателем и статистикой */}
      <div className="hybrid-header">
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            🎴 Сетка
          </button>
          <button 
            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            📊 Таблица
          </button>
        </div>
        
        <div className="hybrid-stats">
          <div className="stat-item">
            <span className="stat-number">{totalSkins}</span>
            <span className="stat-label">скинов</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{statTrakCount}</span>
            <span className="stat-label">StatTrak</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{convertPrice(totalValue)}</span>
            <span className="stat-label">общая стоимость</span>
          </div>
        </div>
      </div>

      {/* Сетка карточек */}
      {viewMode === 'grid' && (
        <div className="hybrid-grid">
          {skins.map((skin) => (
            <div key={skin.id} className="hybrid-card">
              <div className="card-header">
                {skin.statTrak && <span className="stattrak-tag">ST</span>}
                <span className={`quality-tag ${skin.quality.replace(/\s+/g, '-').toLowerCase()}`}>
                  {skin.quality}
                </span>
              </div>
              
              <div className="card-image" onClick={() => showSkinDetails(skin)}>
                <img 
                  src={skin.imageUrl} 
                  alt={skin.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200/1a1a2e/4ecdc4?text=CS2+Skin';
                  }}
                />
                <div className="image-overlay">
                  <span>👁️ Посмотреть</span>
                </div>
              </div>
              
              <div className="card-content">
                <h3 className="skin-name">{skin.name}</h3>
                <p className="skin-weapon">{skin.weapon}</p>
                
                <div className="skin-meta">
                  <span className="float-value">Float: {skin.float}</span>
                  <span className={`condition-badge ${skin.condition.replace(/\s+/g, '-').toLowerCase()}`}>
                    {skin.condition}
                  </span>
                </div>
                
                <div className="price-section">
                  <span className="price">{convertPrice(skin.price)}</span>
                </div>
                
                <div className="card-actions">
                  <button 
                    className="btn-bid"
                    onClick={() => onMakeBid(skin)}
                    title="Сделать ставку"
                  >
                    💎
                  </button>
                  <button 
                    className="btn-view"
                    onClick={() => showSkinDetails(skin)}
                    title="Посмотреть детали"
                  >
                    👁️
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => editSkin(skin)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      if (window.confirm(`Удалить скин "${skin.name}"?`)) {
                        deleteSkin(skin.id);
                      }
                    }}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Табличный вид */}
      {viewMode === 'table' && (
        <div className="hybrid-table-container">
          <div className="responsive-table">
            <table className="skins-table">
              <thead>
                <tr>
                  <th>Скин</th>
                  <th>Информация</th>
                  <th>Характеристики</th>
                  <th>Цена</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {skins.map((skin) => (
                  <tr key={skin.id} className="skin-row">
                    <td>
                      <div className="table-skin-preview">
                        <div 
                          className="table-image"
                          onClick={() => showSkinDetails(skin)}
                        >
                          <img 
                            src={skin.imageUrl} 
                            alt={skin.name}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x60/1a1a2e/4ecdc4?text=CS2';
                            }}
                          />
                          {skin.statTrak && <div className="table-stattrak">ST</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="skin-info-table">
                        <div className="skin-name-table">
                          <strong>{skin.name}</strong>
                          {skin.sticker && skin.sticker !== "Нет стикеров" && (
                            <span className="sticker-indicator" title={skin.sticker}>🎨</span>
                          )}
                        </div>
                        <div className="weapon-table">{skin.weapon}</div>
                      </div>
                    </td>
                    <td>
                      <div className="specs-table">
                        <div className="spec-row">
                          <span>Качество:</span>
                          <span className={`quality-table ${skin.quality.replace(/\s+/g, '-').toLowerCase()}`}>
                            {skin.quality}
                          </span>
                        </div>
                        <div className="spec-row">
                          <span>Состояние:</span>
                          <span className={`condition-table ${skin.condition.replace(/\s+/g, '-').toLowerCase()}`}>
                            {skin.condition}
                          </span>
                        </div>
                        <div className="spec-row">
                          <span>Float:</span>
                          <span className="float-table">{skin.float}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="price-table">
                        <span className="price-amount">{convertPrice(skin.price)}</span>
                        {skin.statTrak && (
                          <span className="stattrak-badge-table">StatTrak™</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-bid-table"
                          onClick={() => onMakeBid(skin)}
                          title="Сделать ставку"
                        >
                          💎
                        </button>
                        <button 
                          className="btn-view-table"
                          onClick={() => showSkinDetails(skin)}
                          title="Посмотреть детали"
                        >
                          👁️
                        </button>
                        <button 
                          className="btn-edit-table"
                          onClick={() => editSkin(skin)}
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-delete-table"
                          onClick={() => {
                            if (window.confirm(`Удалить скин "${skin.name}"?`)) {
                              deleteSkin(skin.id);
                            }
                          }}
                          title="Удалить"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;