import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useCurrency } from '../CurrencyContext';

const BidModal = ({ skin, onClose, onMakeBid, onCancelBid }) => {
  const { user } = useAuth();
  const { convertPrice } = useCurrency();
  const [bidAmount, setBidAmount] = useState(skin.price);
  const [selectedBidToCancel, setSelectedBidToCancel] = useState(null);

  const userBids = skin.bids?.filter(bid => bid.userId === user.id && bid.status === 'active') || [];
  const allBids = skin.bids?.filter(bid => bid.status === 'active') || [];
  const highestBid = allBids.reduce((max, bid) => bid.amount > max.amount ? bid : max, { amount: 0 });

  const handleSubmitBid = (e) => {
    e.preventDefault();
    if (bidAmount > user.balance) {
      alert('❌ Недостаточно средств на балансе!');
      return;
    }
    if (bidAmount <= highestBid.amount) {
      alert(`❌ Ставка должна быть выше текущей максимальной (${convertPrice(highestBid.amount)})`);
      return;
    }
    onMakeBid(skin.id, bidAmount);
    setBidAmount(skin.price);
  };

  const handleCancelBid = (bidId) => {
    onCancelBid(skin.id, bidId);
    setSelectedBidToCancel(null);
  };

  return (
    <div className="bid-modal">
      <div className="bid-header">
        <h2>💎 Ставки на {skin.name}</h2>
        <button className="close-bid" onClick={onClose}>×</button>
      </div>

      <div className="bid-content">
        {/* Информация о балансе */}
        <div className="balance-info">
          <span>Ваш баланс: </span>
          <strong className="user-balance">{convertPrice(user.balance)}</strong>
        </div>

        {/* Текущие ставки */}
        <div className="bids-section">
          <h3>📊 Текущие ставки</h3>
          {allBids.length === 0 ? (
            <p className="no-bids">Ставок пока нет. Будьте первым!</p>
          ) : (
            <div className="bids-list">
              {allBids.map(bid => (
                <div key={bid.id} className={`bid-item ${bid.userId === user.id ? 'my-bid' : ''}`}>
                  <span className="bid-user">{bid.userName}</span>
                  <span className="bid-amount">{convertPrice(bid.amount)}</span>
                  {bid.userId === user.id && (
                    <button 
                      className="cancel-bid-btn"
                      onClick={() => setSelectedBidToCancel(bid.id)}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ваши ставки */}
        {userBids.length > 0 && (
          <div className="my-bids-section">
            <h3>🎯 Ваши ставки</h3>
            <div className="my-bids-list">
              {userBids.map(bid => (
                <div key={bid.id} className="my-bid-item">
                  <span>Ваша ставка: {convertPrice(bid.amount)}</span>
                  <button 
                    className="cancel-my-bid"
                    onClick={() => setSelectedBidToCancel(bid.id)}
                  >
                    Отменить
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Форма новой ставки */}
        <form onSubmit={handleSubmitBid} className="bid-form">
          <h3>💸 Сделать ставку</h3>
          <div className="form-group">
            <label>Сумма ставки:</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              min={highestBid.amount + 1}
              max={user.balance}
              required
            />
            <div className="bid-hints">
              <span>Мин: {convertPrice(highestBid.amount + 1)}</span>
              <span>Макс: {convertPrice(user.balance)}</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-bid-btn"
            disabled={bidAmount > user.balance || bidAmount <= highestBid.amount}
          >
            💎 Сделать ставку {convertPrice(bidAmount)}
          </button>
        </form>
      </div>

      {/* Подтверждение отмены ставки */}
      {selectedBidToCancel && (
        <div className="cancel-confirmation">
          <div className="confirmation-modal">
            <h4>Отменить ставку?</h4>
            <p>Вы уверены, что хотите отменить свою ставку?</p>
            <div className="confirmation-buttons">
              <button 
                className="confirm-cancel"
                onClick={() => handleCancelBid(selectedBidToCancel)}
              >
                ✅ Да, отменить
              </button>
              <button 
                className="cancel-cancel"
                onClick={() => setSelectedBidToCancel(null)}
              >
                ❌ Нет, оставить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidModal;