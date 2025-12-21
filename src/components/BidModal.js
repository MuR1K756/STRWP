import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { selectUser } from '../store/slices/authSlice';
import { selectCurrency, selectExchangeRates, selectConvertedPrice } from '../store/slices/currencySlice';

const BidModal = ({ skin, onClose, onMakeBid, onCancelBid }) => {
  const user = useAppSelector(selectUser);
  const currency = useAppSelector(selectCurrency);
  const exchangeRates = useAppSelector(selectExchangeRates);
  
  // ИСПРАВЛЕНО: Получаем функцию конвертации правильно
  const convertPrice = useAppSelector(selectConvertedPrice);
  
  const [bidAmount, setBidAmount] = useState(skin.price + 1);
  const [selectedBidToCancel, setSelectedBidToCancel] = useState(null);

  const userBids = skin.bids?.filter(bid => bid.userId === user?.id && bid.status === 'active') || [];
  const allBids = skin.bids?.filter(bid => bid.status === 'active') || [];
  
  const highestBidAmount = allBids.length > 0 
    ? Math.max(...allBids.map(bid => bid.amount)) 
    : skin.price;

  const handleSubmitBid = (e) => {
    e.preventDefault();
    if (!user) {
      alert('❌ Необходимо войти в систему!');
      return;
    }
    
    if (bidAmount > user.balance) {
      alert('❌ Недостаточно средств на балансе!');
      return;
    }
    if (bidAmount <= highestBidAmount) {
      alert(`❌ Ставка должна быть выше текущей максимальной (${convertPrice(highestBidAmount)})`);
      return;
    }
    onMakeBid(skin.id, bidAmount);
    setBidAmount(highestBidAmount + 10);
  };

  const handleCancelBid = (bidId) => {
    if (onCancelBid) {
        onCancelBid(skin.id, bidId);
    }
    setSelectedBidToCancel(null);
  };

  if (!user) {
    return (
      <div className="bid-modal">
        <div className="bid-header">
          <h2>🔒 Требуется авторизация</h2>
          <button className="close-bid" onClick={onClose}>×</button>
        </div>
        <div className="bid-content">
          <p>Для участия в ставках необходимо войти в систему.</p>
          <button className="auth-submit-btn" onClick={onClose}>Понятно</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bid-modal">
      <div className="bid-header">
        <h2>💎 Ставки на {skin.name}</h2>
        <button className="close-bid" onClick={onClose}>×</button>
      </div>

      <div className="bid-content">
        <div className="balance-info">
          <span>Ваш баланс: </span>
          <strong className="user-balance">{convertPrice(user.balance)}</strong>
        </div>

        <div className="bids-section">
          <h3>📊 Текущие ставки</h3>
          {allBids.length === 0 ? (
            <p className="no-bids">Ставок пока нет. Будьте первым!</p>
          ) : (
            <div className="bids-list">
              {allBids.map(bid => (
                <div key={bid.id} className={`bid-item ${bid.userId === user.id ? 'my-bid' : ''}`}>
                  <span className="bid-user">{bid.userName || 'Аноним'}</span>
                  <span className="bid-amount">{convertPrice(bid.amount)}</span>
                  {bid.userId === user.id && (
                    <button className="cancel-bid-btn" onClick={() => setSelectedBidToCancel(bid.id)}>❌</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {userBids.length > 0 && (
          <div className="my-bids-section">
            <h3>🎯 Ваши ставки</h3>
            <div className="my-bids-list">
              {userBids.map(bid => (
                <div key={bid.id} className="my-bid-item">
                  <span>Ваша ставка: {convertPrice(bid.amount)}</span>
                  <button className="cancel-my-bid" onClick={() => setSelectedBidToCancel(bid.id)}>Отменить</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitBid} className="bid-form">
          <h3>💸 Сделать ставку</h3>
          <div className="form-group">
            <label>Сумма ставки ({currency}):</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              min={highestBidAmount + 1}
              required
            />
            <div className="bid-hints">
              <span>Мин: {convertPrice(highestBidAmount + 1)}</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-bid-btn"
            disabled={bidAmount > user.balance || bidAmount <= highestBidAmount}
          >
            💎 Сделать ставку {convertPrice(bidAmount)}
          </button>
        </form>
      </div>

      {selectedBidToCancel && (
        <div className="cancel-confirmation">
          <div className="confirmation-modal">
            <h4>Отменить ставку?</h4>
            <div className="confirmation-buttons">
              <button className="confirm-cancel" onClick={() => handleCancelBid(selectedBidToCancel)}>✅ Да</button>
              <button className="cancel-cancel" onClick={() => setSelectedBidToCancel(null)}>❌ Нет</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidModal;