import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { selectUser } from '../store/slices/authSlice';
import { selectCurrency, selectConvertedPrice } from '../store/slices/currencySlice';

const BidModal = ({ skin, onClose, onMakeBid, onCancelBid }) => {
    const user = useAppSelector(selectUser);
    const currency = useAppSelector(selectCurrency);
    const convertPrice = useAppSelector(selectConvertedPrice);
    
    const [bidAmount, setBidAmount] = useState(Number(skin.price) + 10);

    const allBids = skin.bids?.filter(bid => bid.status === 'active') || [];
    //Вычисление максимальной ставки
    const highestBidAmount = allBids.length > 0 
        ? Math.max(...allBids.map(bid => bid.amount)) 
        : skin.price;

    const styles = {
        wrapper: {
            padding: '40px',
            backgroundColor: '#0a0a0a',
            borderRadius: '24px',
            color: '#fff',
            width: '100%',
            maxWidth: '600px', 
            border: '2px solid #1a0505',
            boxShadow: '0 0 40px rgba(0,0,0,0.8)'
        },
        header: {
            borderBottom: '1px solid #1a0505',
            paddingBottom: '20px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        priceBlock: {
            background: 'linear-gradient(135deg, #110202 0%, #050505 100%)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid #b01b2e33',
            marginBottom: '25px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        input: {
            width: '100%',
            backgroundColor: '#050505',
            border: '2px solid #1a0505',
            borderRadius: '12px',
            padding: '15px',
            color: '#fff',
            fontSize: '1.2rem',
            textAlign: 'center',
            marginBottom: '20px',
            outline: 'none',
            transition: 'border-color 0.2s',
        },
        submitBtn: {
            width: '100%',
            padding: '18px',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: '#b01b2e',
            color: '#fff',
            fontWeight: '800',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: '0.3s',
            boxShadow: '0 4px 15px rgba(176, 27, 46, 0.3)'
        },
        bidItem: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 15px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            marginBottom: '8px',
            borderLeft: '3px solid #b01b2e'
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.header}>
                <h2 style={{ margin: 0, fontSize: '1.8rem' }}>💎 Сделать ставку</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#444', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <p style={{ color: '#aaa', marginBottom: '20px' }}>Предмет: <span style={{ color: '#fff', fontWeight: 'bold' }}>{skin.name}</span></p>

            <div style={styles.priceBlock}>
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>Текущая цена</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#b01b2e' }}>{convertPrice(highestBidAmount)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>Ваш баланс</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{convertPrice(user?.balance || 0)}</div>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#888', fontSize: '0.9rem' }}>Ваша сумма:</label>
                <input 
                    type="number" 
                    value={bidAmount} 
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = '#b01b2e'}
                    onBlur={(e) => e.target.style.borderColor = '#1a0505'}
                />
            </div>

            <button 
                style={styles.submitBtn}
                onClick={() => onMakeBid(skin.id, bidAmount)}
                onMouseOver={(e) => e.target.style.backgroundColor = '#d01f36'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#b01b2e'}
            >
                ПОДТВЕРДИТЬ СТАВКУ
            </button>

            {allBids.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ marginBottom: '15px', color: '#666' }}>История торгов</h4>
                    <div style={{ maxHeight: '150px', overflowY: 'auto', paddingRight: '10px' }}>
                        {allBids.map(bid => (
                            <div key={bid.id} style={styles.bidItem}>
                                <span>{bid.userName}</span>
                                <span style={{ fontWeight: 'bold' }}>{convertPrice(bid.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BidModal;