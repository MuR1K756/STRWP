import React from "react";
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { selectViewMode, setViewMode, setBidModalSkin } from './store/slices/uiSlice';
import { selectConvertedPrice } from './store/slices/currencySlice';
import { setSelectedSkin } from './store/slices/skinsSlice';

const Table = ({ skins, deleteSkin, editSkin }) => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(selectViewMode);
  const convertPrice = useAppSelector(selectConvertedPrice);
  
  const placeholderImage = "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2G9S68sh2L2S9N6tjVfsqkJrZWCgcY_AdlA8M1_R_lS_l-7thp_u7Z_LzXUyuXY8pSGK_vY9V3M/360fx360f";

  // Функция защиты от "черного экрана": превращает объекты в строку
  const safeRender = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Безопасное получение цены
  const getSafePrice = (price) => {
    try {
        return convertPrice(Number(price) || 0);
    } catch (e) {
        return price + " $";
    }
  };

  const styles = {
    container: { marginTop: '20px' },
    controls: { marginBottom: '20px', display: 'flex', gap: '10px' },
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
      transition: '0.2s',
      flex: 1
    }),
    qualityText: {
        fontSize: '0.75rem',
        color: 'var(--accent-primary)',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
  };

  const renderActionButtons = (skin) => (
    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
      <button style={styles.btn('var(--accent-primary)')} onClick={() => dispatch(setBidModalSkin(skin))} title="Сделать ставку">💎</button>
      <button style={styles.btn('#444', true)} onClick={() => dispatch(setSelectedSkin(skin))} title="Посмотреть">👁️</button>
      <button style={styles.btn('#600', true)} onClick={() => editSkin(skin)} title="Редактировать">✏️</button>
      <button style={styles.btn('#222', true)} onClick={() => deleteSkin(skin.id)} title="Удалить">🗑️</button>
    </div>
  );

  if (!skins || skins.length === 0) return <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-primary)' }}>Скинов не найдено</div>;

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <button 
          onClick={() => dispatch(setViewMode('grid'))} 
          style={styles.btn(viewMode === 'grid' ? 'var(--accent-primary)' : '#333')}
        >Сетка</button>
        <button 
          onClick={() => dispatch(setViewMode('table'))} 
          style={styles.btn(viewMode === 'table' ? 'var(--accent-primary)' : '#333')}
        >Список</button>
      </div>

      {viewMode === 'grid' ? (
        <div style={styles.grid}>
          {skins.map((skin) => (
            <div key={skin.id} style={styles.card}>
              <div style={{textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '10px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)'}}>
                <img src={skin.imageUrl || placeholderImage} alt={safeRender(skin.name)} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1rem' }}>{safeRender(skin.name)}</div>
                <div style={styles.qualityText}>{safeRender(skin.quality) || 'Прямо с завода'}</div>
              </div>
              <div style={styles.priceTag}>{getSafePrice(skin.price)}</div>
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
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{safeRender(skin.name)}</div>
                        <div style={styles.qualityText}>{safeRender(skin.quality)}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}><div style={styles.priceTag}>{getSafePrice(skin.price)}</div></td>
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