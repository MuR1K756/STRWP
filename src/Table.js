import React from "react";
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { selectViewMode, setViewMode } from './store/slices/uiSlice';
import { selectCurrency, selectExchangeRates, selectConvertedPrice } from './store/slices/currencySlice';
import { selectUser } from './store/slices/authSlice';

const Table = ({ skins, deleteSkin, editSkin, showSkinDetails, onMakeBid }) => {
  const dispatch = useAppDispatch();
  
  const viewMode = useAppSelector(selectViewMode);
  const currency = useAppSelector(selectCurrency);
  const exchangeRates = useAppSelector(selectExchangeRates);
  const user = useAppSelector(selectUser);
  
  const convertPrice = selectConvertedPrice(currency, exchangeRates);

  const handleSetViewMode = (mode) => {
    dispatch(setViewMode(mode));
  };

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
  
  // Статистика по ставкам
  const totalBids = skins.reduce((sum, skin) => 
    sum + (skin.bids ? skin.bids.filter(bid => bid.status === 'active').length : 0), 0
  );

  return (
    <div className="hybrid-container">
      {/* Хедер с переключателем и статистикой */}
      <div className="hybrid-header">
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => handleSetViewMode('grid')}
          >
            🎴 Сетка
          </button>
          <button 
            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => handleSetViewMode('table')}
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
            <span className="stat-number">{totalBids}</span>
            <span className="stat-label">ставок</span>
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
          {skins.map((skin) => {
            const activeBids = skin.bids ? skin.bids.filter(bid => bid.status === 'active') : [];
            const userBids = activeBids.filter(bid => bid.userId === user?.id);
            const highestBid = activeBids.length > 0 ? Math.max(...activeBids.map(bid => bid.amount)) : skin.price;
            
            return (
              <div key={skin.id} className="hybrid-card">
                <div className="card-header">
                  {skin.statTrak && <span className="stattrak-tag">ST</span>}
                  <span className={`quality-tag ${skin.quality.replace(/\s+/g, '-').toLowerCase()}`}>
                    {skin.quality}
                  </span>
                  {/* Индикатор ставок */}
                  {activeBids.length > 0 && (
                    <span className="bid-indicator">
                      💎 {activeBids.length}
                      {userBids.length > 0 && <span className="my-bid-dot">⭐</span>}
                    </span>
                  )}
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
                  {/* Бейдж моих ставок */}
                  {userBids.length > 0 && (
                    <div className="my-bids-badge">
                      Ваши ставки: {userBids.length}
                    </div>
                  )}
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
                    <span className="price">
                      {activeBids.length > 0 ? (
                        <>
                          {convertPrice(highestBid)}
                          <small className="bid-price-note"> (ставка)</small>
                        </>
                      ) : (
                        convertPrice(skin.price)
                      )}
                    </span>
                    {userBids.length > 0 && (
                      <div className="user-bids-info">
                        Ваша макс: {convertPrice(Math.max(...userBids.map(bid => bid.amount)))}
                      </div>
                    )}
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
            );
          })}
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
                  <th>Цена / Ставки</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {skins.map((skin) => {
                  const activeBids = skin.bids ? skin.bids.filter(bid => bid.status === 'active') : [];
                  const userBids = activeBids.filter(bid => bid.userId === user?.id);
                  const highestBid = activeBids.length > 0 ? Math.max(...activeBids.map(bid => bid.amount)) : skin.price;
                  
                  return (
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
                            {activeBids.length > 0 && (
                              <div className="table-bid-indicator">
                                💎 {activeBids.length}
                              </div>
                            )}
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
                            {userBids.length > 0 && (
                              <span className="user-bid-indicator" title="У вас есть ставки">⭐</span>
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
                          <span className="price-amount">
                            {activeBids.length > 0 ? (
                              <>
                                {convertPrice(highestBid)}
                                <div className="bid-info">
                                  <small>{activeBids.length} ставок</small>
                                  {userBids.length > 0 && (
                                    <small className="user-bid-info">Ваша: {convertPrice(Math.max(...userBids.map(bid => bid.amount)))}</small>
                                  )}
                                </div>
                              </>
                            ) : (
                              convertPrice(skin.price)
                            )}
                          </span>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;