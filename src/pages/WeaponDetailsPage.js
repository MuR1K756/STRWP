import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setSelectedSkin } from '../store/slices/skinsSlice';
import { setBidModalSkin } from '../store/slices/uiSlice';
import { selectConvertedPrice } from '../store/slices/currencySlice';

const WeaponDetailsPage = () => {
    const dispatch = useAppDispatch();
    const selectedSkin = useAppSelector(state => state.skins.selectedSkin);
    const allSkins = useAppSelector(state => state.skins.items); 
    const convertPrice = useAppSelector(selectConvertedPrice);

    if (!selectedSkin) return null;

    const otherOffers = allSkins.filter(s => 
        s.weapon?.toLowerCase() === selectedSkin.weapon?.toLowerCase()
    );

    const handleClose = () => dispatch(setSelectedSkin(null));

    const handlePlaceBid = () => {
        dispatch(setBidModalSkin(selectedSkin));
    };

    const displayPrice = (price) => {
        return typeof convertPrice === 'function' ? convertPrice(price) : `${price} $`;
    };

    const styles = {
        overlay: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 9999,
            padding: '20px', backdropFilter: 'blur(10px)'
        },
        modal: {
            backgroundColor: '#0a0a0a', borderRadius: '32px',
            width: '100%', maxWidth: '1100px', display: 'flex',
            flexDirection: 'column', overflow: 'hidden',
            border: '2px solid #1a0505', boxShadow: '0 0 50px rgba(0,0,0,0.8)',
            position: 'relative', maxHeight: '95vh' 
        },
        mainContent: { 
            display: 'flex', 
            flexDirection: 'row', 
            flex: '1', 
            minHeight: '0', 
            overflow: 'hidden' 
        },
        imageContainer: {
            flex: 1.2, background: 'radial-gradient(circle, #1a0505 0%, #050505 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        },
        detailsContainer: {
            flex: 1, 
            padding: '30px 40px', 
            display: 'flex',
            flexDirection: 'column', 
            gap: '12px', 
            overflowY: 'auto' 
        },
        bidInfoBox: {
            background: 'rgba(176, 27, 46, 0.05)',
            border: '1px solid #b01b2e44',
            borderRadius: '16px',
            padding: '15px', 
            margin: '5px 0'
        }
    };

    return (
        <div style={styles.overlay} onClick={handleClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button 
                    onClick={handleClose}
                    style={{ position: 'absolute', top: '20px', right: '25px', background: 'none', border: 'none', color: '#444', fontSize: '35px', cursor: 'pointer', zIndex: 10 }}
                >
                    &times;
                </button>
                
                <div style={styles.mainContent}>
                    <div style={styles.imageContainer}>
                        <img 
                            src={selectedSkin.imageUrl} 
                            alt={selectedSkin.name} 
                            style={{ width: '100%', maxHeight: '350px', objectFit: 'contain' }} 
                        />
                    </div>

                    <div style={styles.detailsContainer}>
                        <div>
                            <span style={{ backgroundColor: '#b01b2e', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {selectedSkin.quality}
                            </span>
                            <h1 style={{ margin: '10px 0 2px 0', fontSize: '2.2rem', fontWeight: '900', color: '#fff', lineHeight: '1.1' }}>
                                {selectedSkin.name}
                            </h1>
                            <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>{selectedSkin.weapon}</p>
                        </div>

                        <div style={{ margin: '5px 0' }}>
                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>ТЕКУЩАЯ СТАВКА</div>
                            <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#b01b2e', lineHeight: '1' }}>
                                {displayPrice(selectedSkin.price)}
                            </div>
                        </div>

                        <div style={styles.bidInfoBox}>
                            {selectedSkin.bids?.length > 0 ? (
                                <>
                                    <div style={{ color: '#b01b2e', fontWeight: 'bold', fontSize: '0.9rem' }}>🔥 ИДУТ ТОРГИ</div>
                                    <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '2px' }}>
                                        Ставок: {selectedSkin.bids.length} | Последняя: {selectedSkin.bids[selectedSkin.bids.length-1].userName.split('@')[0]}
                                    </div>
                                </>
                            ) : (
                                <div style={{ color: '#666', fontSize: '0.85rem' }}>Ставок пока нет.</div>
                            )}
                        </div>

                        <div style={{ color: '#aaa', fontSize: '0.85rem' }}>
                            <strong>Float:</strong> <span style={{ color: '#b01b2e', fontFamily: 'monospace' }}>{selectedSkin.float || '0.0000'}</span>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '10px' }}>
                            <button 
                                onClick={handlePlaceBid}
                                style={{ 
                                    backgroundColor: '#b01b2e', color: '#fff', border: 'none', 
                                    padding: '16px', borderRadius: '14px', fontWeight: 'bold', 
                                    fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 15px rgba(176,27,46,0.2)',
                                    transition: '0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#d01f36'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#b01b2e'}
                            >
                                СДЕЛАТЬ СТАВКУ
                            </button>
                        </div>
                    </div>
                </div>

                {otherOffers.length > 1 && (
                    <div style={{ padding: '20px 40px', background: '#050505', borderTop: '1px solid #1a0505' }}>
                        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.8rem', fontWeight: 'bold' }}>ДРУГИЕ ПРЕДЛОЖЕНИЯ</p>
                        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '5px' }}>
                            {otherOffers.map(offer => (
                                <div 
                                    key={offer.id}
                                    onClick={() => dispatch(setSelectedSkin(offer))}
                                    style={{ 
                                        minWidth: '160px', padding: '12px', borderRadius: '12px', background: '#0a0a0a', 
                                        border: offer.id === selectedSkin.id ? '2px solid #b01b2e' : '1px solid #1a0505',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{offer.name}</div>
                                    <div style={{ color: '#b01b2e', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '3px' }}>{displayPrice(offer.price)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeaponDetailsPage;