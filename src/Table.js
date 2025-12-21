import React, { useState } from "react"; // Добавили useState для примера
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { selectViewMode, setViewMode, setBidModalSkin } from './store/slices/uiSlice';
import { selectConvertedPrice } from './store/slices/currencySlice';
import { setSelectedSkin } from './store/slices/skinsSlice';

const Table = ({ skins, deleteSkin, editSkin }) => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(selectViewMode);
  const theme = useAppSelector(state => state.ui.theme);
  const convertPrice = useAppSelector(selectConvertedPrice);
  
  // Если у тебя нет newSkin в пропсах, используем этот локальный для проверки
  const [localQuality, setLocalQuality] = useState("Прямо с завода");

  const placeholderImage = "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2G9S68sh2L2S9N6tjVfsqkJrZWCgcY_AdlA8M1_R_lS_l-7thp_u7Z_LzXUyuXY8pSGK_vY9V3M/360fx360f";

  const styles = {
    container: { marginTop: '20px' },
    controls: { marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
    card: {
      backgroundColor: 'var(--card-bg)',
      borderRadius: '24px',
      padding: '20px',
      boxShadow: 'var(--shadow)',
      border: '2px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    priceTag: {
      fontSize: '1.1rem',
      fontWeight: '800',
      color: '#fff',
      background: 'var(--accent-primary)',
      padding: '4px 12px',
      borderRadius: '8px',
      width: 'fit-content',
    },
    btn: (bg, isSecondary) => ({
      backgroundColor: bg,
      opacity: isSecondary ? 0.8 : 1,
      color: '#fff',
      border: 'none',
      padding: '10px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '700',
      transition: '0.2s'
    }),
    // Стиль для селектора качества
    selectField: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      marginBottom: '20px'
    },
    select: {
      padding: '12px',
      borderRadius: '12px',
      backgroundColor: '#1a0505',
      color: '#fff',
      border: '1px solid #800000',
      outline: 'none',
      width: '200px'
    }
  };

  const renderActionButtons = (skin) => (
    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
      <button style={{...styles.btn('var(--accent-primary)'), flex: 1}} onClick={() => dispatch(setBidModalSkin(skin))}>💎</button>
      <button style={{...styles.btn('#444', true), flex: 1}} onClick={() => dispatch(setSelectedSkin(skin))}>👁️</button>
      <button style={{...styles.btn('#600', true), flex: 1}} onClick={() => editSkin(skin)}>✏️</button>
      <button style={{...styles.btn('#222', true), flex: 1}} onClick={() => deleteSkin(skin.id)}>🗑️</button>
    </div>
  );

  if (!skins || skins.length === 0) return <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-primary)' }}>Скинов не найдено</div>;

  return (
    <div style={styles.container}>
      
      {/* СЕКЦИЯ КАЧЕСТВА - ТЕПЕРЬ ОНА ВСЕГДА ВИДНА ТУТ */}
      <div style={styles.selectField}>
        <label style={{color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'}}>Качество предмета:</label>
        <select 
          style={styles.select} 
          value={localQuality} 
          onChange={(e) => setLocalQuality(e.target.value)}
        >
          <option value="Прямо с завода">Прямо с завода</option>
          <option value="Немного поношенное">Немного поношенное</option>
          <option value="После полевых испытаний">После полевых испытаний</option>
          <option value="Поношенное">Поношенное</option>
          <option value="Закаленное в боях">Закаленное в боях</option>
        </select>
      </div>

      <div style={styles.controls}>
        <button 
          onClick={() => dispatch(setViewMode('grid'))} 
          style={{...styles.btn(viewMode === 'grid' ? 'var(--accent-primary)' : '#333'), width: '100px'}}
        >Сетка</button>
        <button 
          onClick={() => dispatch(setViewMode('table'))} 
          style={{...styles.btn(viewMode === 'table' ? 'var(--accent-primary)' : '#333'), width: '100px'}}
        >Список</button>
      </div>

      {viewMode === 'grid' ? (
        <div style={styles.grid}>
          {skins.map((skin) => (
            <div key={skin.id} style={styles.card}>
              <div style={{textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '10px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)'}}>
                <img src={skin.imageUrl || placeholderImage} alt={skin.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1rem' }}>{skin.name}</div>
              <div style={styles.priceTag}>{convertPrice(skin.price)}</div>
              {renderActionButtons(skin)}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: 'var(--card-bg)', borderRadius: '24px', border: '2px solid var(--border-color)', padding: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '20px', textAlign: 'left', color: 'var(--accent-primary)' }}>Предмет</th>
                <th style={{ padding: '20px', textAlign: 'left', color: 'var(--accent-primary)' }}>Цена</th>
                <th style={{ padding: '20px', textAlign: 'right', color: 'var(--accent-primary)' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {skins.map((skin) => (
                <tr key={skin.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={skin.imageUrl || placeholderImage} alt="" style={{ width: '70px', height: '50px', objectFit: 'contain', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }} />
                      <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{skin.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}><div style={styles.priceTag}>{convertPrice(skin.price)}</div></td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>{renderActionButtons(skin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Table;