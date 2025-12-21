import React, { useState } from "react";
import { SKINS_DATABASE } from './skinsData';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { selectCurrency, selectExchangeRates, setCurrency } from './store/slices/currencySlice';
import { selectTheme } from './store/slices/uiSlice';

const Form = ({ handleSubmit, inSkin, isEditing, user }) => {
    const dispatch = useAppDispatch();
    
    const themeMode = useAppSelector(selectTheme);
    const isDark = themeMode === 'dark';
    
    // 1. ДОБАВЛЕНО: Поле quality в начальный стейт
    const [skin, setSkin] = useState(() => ({
        weapon: inSkin?.weapon || '',
        name: inSkin?.name || '',
        imageUrl: inSkin?.imageUrl || '',
        price: inSkin?.price || 0,
        float: inSkin?.float || '',
        quality: inSkin?.quality || 'Прямо с завода', // Значение по умолчанию
        description: inSkin?.description || '',
        ownerId: inSkin?.ownerId || user?.id
    }));

    const [imagePreview, setImagePreview] = useState(inSkin?.imageUrl || null);
    const [isCustomName, setIsCustomName] = useState(false);
    
    const currentCurrency = useAppSelector(selectCurrency);
    const exchangeRates = useAppSelector(selectExchangeRates);
    const rate = exchangeRates[currentCurrency] || 1;
    const displayValue = skin.price ? Math.round(skin.price * rate) : '';

    const handleWeaponChange = (e) => {
        const weapon = e.target.value;
        setSkin(prev => ({ ...prev, weapon, name: '', imageUrl: '' }));
        setImagePreview(null);
        setIsCustomName(false);
    };

    const handleSkinNameChange = (e) => {
        const selectedSkin = e.target.value;
        if (selectedSkin === "CUSTOM") {
            setIsCustomName(true);
            setSkin(prev => ({ ...prev, name: `${prev.weapon} | ` }));
            return;
        }

        const skinData = SKINS_DATABASE[skin.weapon]?.find(s => s.name === selectedSkin);
        if (skinData) {
            const fullName = `${skin.weapon} | ${selectedSkin}`;
            setSkin(prev => ({ ...prev, name: fullName, imageUrl: skinData.url }));
            setImagePreview(skinData.url);
        }
    };

    const handleFloatChange = (e) => {
        let val = e.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
        if ((val.match(/\./g) || []).length > 1) return;
        if (parseFloat(val) > 1) val = "1.00";
        setSkin(prev => ({ ...prev, float: val }));
    };

    const isFormValid = skin.weapon && skin.name && skin.imageUrl && skin.price > 0;

    const styles = {
        panel: {
            background: 'var(--bg-secondary)',
            padding: '2rem',
            borderRadius: '24px',
            border: '2px solid var(--border-color)',
            maxWidth: '500px',
            margin: '0 auto',
            boxShadow: 'var(--shadow)',
            color: 'var(--text-primary)'
        },
        sectionTitle: { fontSize: '0.75rem', fontWeight: '900', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '8px' },
        input: {
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            background: isDark ? '#1a0505' : '#ffffff', 
            border: '2px solid var(--border-color)',
            color: isDark ? '#ffffff' : '#000000',
            marginBottom: '1.2rem',
            outline: 'none',
            fontSize: '1rem'
        },
        option: {
            background: isDark ? '#1a0505' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
        },
        currencyBtn: (active) => ({
            flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
            background: active ? 'var(--accent-primary)' : 'var(--bg-primary)',
            color: active ? '#fff' : 'var(--text-primary)',
            fontWeight: 'bold', cursor: 'pointer'
        })
    };

    return (
        <div style={styles.panel}>
            <form onSubmit={(e) => { e.preventDefault(); if(isFormValid) handleSubmit(skin); }}>
                
                <p style={styles.sectionTitle}>1. Оружие</p>
                <select style={styles.input} value={skin.weapon} onChange={handleWeaponChange} required>
                    <option value="" style={styles.option}>Выберите пушку</option>
                    <optgroup label="Пистолеты" style={styles.option}>
                            <option value="Glock-18">Glock-18</option>
                            <option value="USP-S">USP-S</option>
                            <option value="P250">P250</option>
                            <option value="Desert Eagle">Desert Eagle</option>
                            <option value="Dual Berettas">Dual Berettas</option>
                            <option value="Five-SeveN">Five-SeveN</option>
                            <option value="Tec-9">Tec-9</option>
                            <option value="CZ75-Auto">CZ75-Auto</option>
                            <option value="R8 Revolver">R8 Revolver</option>
                        </optgroup>

                        <optgroup label="Винтовки" style={styles.option}>
                            <option value="AK-47">AK-47</option>
                            <option value="M4A4">M4A4</option>
                            <option value="M4A1-S">M4A1-S</option>
                            <option value="Galil AR">Galil AR</option>
                            <option value="FAMAS">FAMAS</option>
                            <option value="AUG">AUG</option>
                            <option value="SG 553">SG 553</option>
                        </optgroup>

                        <optgroup label="Снайперские" style={styles.option}>
                            <option value="AWP">AWP</option>
                            <option value="SSG 08">SSG 08</option>
                            <option value="SCAR-20">SCAR-20</option>
                            <option value="G3SG1">G3SG1</option>
                        </optgroup>

                        <optgroup label="ПП (SMGs)" style={styles.option}>
                            <option value="MAC-10">MAC-10</option>
                            <option value="MP9">MP9</option>
                            <option value="MP7">MP7</option>
                            <option value="MP5-SD">MP5-SD</option>
                            <option value="UMP-45">UMP-45</option>
                            <option value="P90">P90</option>
                            <option value="PP-Bizon">PP-Bizon</option>
                        </optgroup>

                        <optgroup label="Тяжелое" style={styles.option}>
                            <option value="Nova">Nova</option>
                            <option value="XM1014">XM1014</option>
                            <option value="MAG-7">MAG-7</option>
                            <option value="Sawed-Off">Sawed-Off</option>
                            <option value="M249">M249</option>
                            <option value="Negev">Negev</option>
                        </optgroup>

                        <optgroup label="Ножи" style={styles.option}>
                            <option value="Karambit">Karambit</option>
                            <option value="Butterfly Knife">Butterfly Knife</option>
                            <option value="Bayonet">Bayonet</option>
                            <option value="M9 Bayonet">M9 Bayonet</option>
                            <option value="Ursus Knife">Ursus Knife</option>
                            <option value="Skeleton Knife">Skeleton Knife</option>
                            <option value="Talon Knife">Talon Knife</option>
                            <option value="Stiletto Knife">Stiletto Knife</option>
                            <option value="Gut Knife">Gut Knife</option>
                            <option value="Shadow Daggers">Shadow Daggers</option>
                            <option value="Bowie Knife">Bowie Knife</option>
                            <option value="Navaja Knife">Navaja Knife</option>
                            <option value="Paracord Knife">Paracord Knife</option>
                            <option value="Huntsman Knife">Huntsman Knife</option>
                            <option value="Falchion Knife">Falchion Knife</option>
                            <option value="Survival Knife">Survival Knife</option>
                            <option value="Nomad Knife">Nomad Knife</option>
                            <option value="Flip Knife">Flip Knife</option>
                            <option value="Kukri Knife">Kukri Knife</option>
                            <option value="Classic Knife">Classic Knife</option>
                            </optgroup>
                </select>

                <p style={styles.sectionTitle}>2. Скин</p>
                {skin.weapon && SKINS_DATABASE[skin.weapon] && !isCustomName ? (
                    <select 
                        style={styles.input} 
                        value={skin.name.split(' | ')[1] || ''} 
                        onChange={handleSkinNameChange} 
                        required
                    >
                        <option value="" style={styles.option}>Выберите раскраску</option>
                        {SKINS_DATABASE[skin.weapon].map(s => (
                            <option key={s.name} value={s.name} style={styles.option}>{s.name}</option>
                        ))}
                        <option value="CUSTOM" style={styles.option}>+ Свой вариант</option>
                    </select>
                ) : (
                    <input style={styles.input} type="text" value={skin.name} onChange={(e) => setSkin({...skin, name: e.target.value})} placeholder="AK-47 | Название" required />
                )}

                {/* 2. ДОБАВЛЕНО: Новое поле выбора Качества */}
                <p style={styles.sectionTitle}>3. Качество предмета</p>
                <select 
                    style={styles.input} 
                    value={skin.quality} 
                    onChange={(e) => setSkin({...skin, quality: e.target.value})}
                >
                    <option value="Прямо с завода" style={styles.option}>Прямо с завода</option>
                    <option value="Немного поношенное" style={styles.option}>Немного поношенное</option>
                    <option value="После полевых испытаний" style={styles.option}>После полевых испытаний</option>
                    <option value="Поношенное" style={styles.option}>Поношенное</option>
                    <option value="Закаленное в боях" style={styles.option}>Закаленное в боях</option>
                </select>

                <p style={styles.sectionTitle}>4. Изображение</p>
                <input style={styles.input} type="url" value={skin.imageUrl} onChange={(e) => { setSkin({...skin, imageUrl: e.target.value}); setImagePreview(e.target.value); }} placeholder="URL картинки" required />
                
                {imagePreview && (
                    <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '15px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                        <img src={imagePreview} alt="Preview" style={{ maxHeight: '80px' }} />
                    </div>
                )}

                <p style={styles.sectionTitle}>5. Цена и Валюта</p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                    {['RUB', 'BYN', 'USD'].map(cur => (
                        <button key={cur} type="button" style={styles.currencyBtn(currentCurrency === cur)} onClick={() => dispatch(setCurrency(cur))}>
                            {cur}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 2 }}>
                        <input style={styles.input} type="text" value={displayValue} onChange={(e) => setSkin({...skin, price: Math.round((parseInt(e.target.value.replace(/\D/g,'')) || 0) / rate)})} placeholder="Цена" required />
                    </div>
                    <div style={{ flex: 1.5 }}>
                        <input style={styles.input} type="text" value={skin.float} onChange={handleFloatChange} placeholder="Float" />
                    </div>
                </div>

                <button type="submit" disabled={!isFormValid} style={{ width: '100%', padding: '18px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: isFormValid ? 'pointer' : 'not-allowed' }}>
                    {isEditing ? 'ОБНОВИТЬ' : 'ВЫСТАВИТЬ'}
                </button>
            </form>
        </div>
    );
};

export default Form;