import React from 'react';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SkinDetailsModal = ({ skin, open, onClose, isDark }) => {
  if (!skin) return null;

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        backgroundColor: isDark ? '#120202' : '#fff',
        color: isDark ? '#fff' : '#000',
        width: '500px',
        maxWidth: '90%',
        padding: '30px',
        borderRadius: '24px',
        border: '2px solid #800000',
        boxShadow: '0 0 40px rgba(0,0,0,0.8)',
        outline: 'none',
        position: 'relative'
      }}>
        {/* Кнопка закрытия в углу */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
        >
          <CloseIcon />
        </button>

        <h2 style={{ color: '#aa0000', marginTop: 0, fontSize: '1.5rem', textTransform: 'uppercase' }}>{skin.name}</h2>

        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '15px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
          <img src={skin.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
            <span style={{ opacity: 0.5 }}>Качество:</span>
            <span style={{ fontWeight: 'bold' }}>{skin.quality || "Не указано"}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.5 }}>Float Value:</span>
            <span style={{ color: '#ff4444', fontWeight: 'bold' }}>{skin.float || "0.00"}</span>
          </div>

          <div style={{ marginTop: '10px' }}>
            <p style={{ color: '#aa0000', fontWeight: 'bold', margin: '0 0 5px 0', fontSize: '0.8rem' }}>ОПИСАНИЕ:</p>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem', fontStyle: 'italic' }}>{skin.description || "Описание отсутствует"}</p>
          </div>
        </div>

        {/* ЭТА КНОПКА ТЕПЕРЬ ТОЧНО БОРДОВАЯ */}
        <button 
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: '#800000',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '12px',
            marginTop: '25px',
            fontWeight: '900',
            fontSize: '1rem',
            cursor: 'pointer',
            textTransform: 'uppercase'
          }}
        >
          Закрыть
        </button>
      </div>
    </Modal>
  );
};

export default SkinDetailsModal;