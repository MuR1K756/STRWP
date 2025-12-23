import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { selectConvertedPrice } from '../store/slices/currencySlice';
import { setSelectedSkin } from '../store/slices/skinsSlice';
import { updateBalance, updateProfile, logout } from '../store/slices/authSlice';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const priceFormatter = useAppSelector(selectConvertedPrice);
    const skins = useAppSelector(state => state.skins?.items || []);
    const currentUser = useAppSelector(state => state.auth?.user || null);

    if (!currentUser) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>
                <h2>Пожалуйста, войдите в аккаунт</h2>
            </div>
        );
    }

    // --- ЛОГИКА ВЗАИМОДЕЙСТВИЯ С AUTHSLICE ---

    const handleDeposit = () => {
        const amount = prompt("Введите сумму для пополнения:", "1000");
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount) && parsedAmount > 0) {
            dispatch(updateBalance(parsedAmount));
        }
    };

    const handleChangeAvatar = () => {
        const newUrl = prompt("Введите прямую ссылку на новое изображение аватара:", currentUser.avatar);
        if (newUrl && newUrl.trim() !== "") {
            dispatch(updateProfile({ avatar: newUrl }));
        }
    };

    const handleLogout = () => {
        if (window.confirm("Вы уверены, что хотите выйти?")) {
            dispatch(logout());
        }
    };

    // --- ДАННЫЕ СКИНОВ ---

    const userSkins = skins.filter(s => s?.ownerId === currentUser?.id);
    
    const userBids = skins.filter(skin => 
        skin.bids?.some(bid => bid.userId === currentUser.id)
    ).map(skin => {
        const myBid = [...skin.bids].reverse().find(b => b.userId === currentUser.id);
        return { skin, myAmount: myBid?.amount };
    });

    const formatPrice = (amount) => {
        return typeof priceFormatter === 'function' ? priceFormatter(amount) : `${amount} $`;
    };

    // --- СТИЛИ ---

    const styles = {
        container: { padding: '20px', maxWidth: '1000px', margin: '0 auto', color: '#fff' },
        header: {
            display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '30px',
            background: '#110202', padding: '30px', borderRadius: '24px', border: '2px solid #1a0505',
            position: 'relative'
        },
        avatarContainer: { position: 'relative', cursor: 'pointer' },
        avatar: { width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #b01b2e', objectFit: 'cover' },
        avatarOverlay: {
            position: 'absolute', bottom: 0, right: 0, background: '#b01b2e', 
            borderRadius: '50%', width: '30px', height: '30px', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', fontSize: '12px'
        },
        balanceCard: {
            background: 'linear-gradient(135deg, #b01b2e, #7a121f)',
            padding: '20px', borderRadius: '20px', color: '#fff', minWidth: '250px',
            display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
        },
        btnDeposit: { 
            background: '#fff', border: 'none', borderRadius: '10px', padding: '10px', 
            fontWeight: 'bold', cursor: 'pointer', color: '#000', marginTop: '5px' 
        },
        btnLogout: {
            position: 'absolute', top: '20px', right: '20px', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)', color: '#ff4444', 
            padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px'
        },
        itemRow: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '15px 20px', background: '#0a0a0a', borderRadius: '16px',
            border: '1px solid #1a0505', cursor: 'pointer', marginBottom: '12px',
            transition: 'transform 0.2s'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={handleLogout} style={styles.btnLogout}>ВЫЙТИ</button>
                
                <div style={styles.avatarContainer} onClick={handleChangeAvatar} title="Нажмите, чтобы изменить аватар">
                    <img src={currentUser.avatar} alt="Avatar" style={styles.avatar} />
                    <div style={styles.avatarOverlay}>✎</div>
                </div>

                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>{currentUser.username || 'Пользователь'}</h1>
                    <p style={{ opacity: 0.6, margin: '5px 0' }}>Активный коллекционер</p>
                    <p style={{ fontSize: '12px', opacity: 0.4 }}>ID: {currentUser.id}</p>
                </div>

                <div style={styles.balanceCard}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.8 }}>ДОСТУПНЫЙ БАЛАНС</span>
                    <span style={{ fontSize: '2.2rem', fontWeight: '900' }}>{formatPrice(currentUser.balance || 0)}</span>
                    <button onClick={handleDeposit} style={styles.btnDeposit}>
                        ПОПОЛНИТЬ
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* КОЛОНКА 1: МОИ ЛОТЫ */}
                <div>
                    <h3 style={{ borderLeft: '4px solid #b01b2e', paddingLeft: '15px', marginBottom: '20px' }}>МОИ ЛОТЫ ({userSkins.length})</h3>
                    {userSkins.length === 0 && <p style={{ opacity: 0.4 }}>У вас пока нет выставленных скинов</p>}
                    {userSkins.map(skin => (
                        <div key={skin.id} style={styles.itemRow} onClick={() => dispatch(setSelectedSkin(skin))}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src={skin.imageUrl} alt="" style={{ width: '50px', height: '40px', objectFit: 'contain' }} />
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{skin.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#b01b2e' }}>{skin.quality}</div>
                                </div>
                            </div>
                            <div style={{ fontWeight: 'bold', color: '#fff' }}>{formatPrice(skin.price)}</div>
                        </div>
                    ))}
                </div>

                {/* КОЛОНКА 2: МОИ СТАВКИ */}
                <div>
                    <h3 style={{ borderLeft: '4px solid #b01b2e', paddingLeft: '15px', marginBottom: '20px' }}>АКТИВНЫЕ СТАВКИ ({userBids.length})</h3>
                    {userBids.length === 0 && <p style={{ opacity: 0.4 }}>Вы еще не участвовали в торгах</p>}
                    {userBids.map((item, idx) => (
                        <div key={item.skin.id || idx} 
                             style={{ ...styles.itemRow, borderLeft: '4px solid #b01b2e' }} 
                             onClick={() => dispatch(setSelectedSkin(item.skin))}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src={item.skin.imageUrl} alt="" style={{ width: '50px', height: '40px', objectFit: 'contain' }} />
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{item.skin.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#aaa' }}>
                                        Ваша: <span style={{ color: '#fff' }}>{formatPrice(item.myAmount)}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#b01b2e', fontWeight: 'bold' }}>{formatPrice(item.skin.price)}</div>
                                <div style={{ fontSize: '0.65rem', color: '#00ff00' }}>В ПРОЦЕССЕ</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;