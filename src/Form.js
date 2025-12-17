import React from "react";
import { useState, useEffect } from "react";
import { useAppSelector } from './hooks/redux';
import { selectCurrency, selectExchangeRates } from './store/slices/currencySlice';

const Form = ({ handleSubmit, inSkin, isEditing, onCancel, user, isOwner }) => {
    const [skin, setSkin] = useState(inSkin);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    
    // Получаем валюту и курсы
    const currency = useAppSelector(selectCurrency);
    const exchangeRates = useAppSelector(selectExchangeRates);
    
    // Функция конвертации цены для отображения
    const convertPriceForDisplay = (priceInRub) => {
        const rate = exchangeRates[currency];
        const converted = priceInRub * rate;
        
        switch (currency) {
            case 'USD':
                return `$${converted.toFixed(2)}`;
            case 'BYN':
                return `${converted.toFixed(2)} BYN`;
            case 'RUB':
            default:
                return `${converted.toLocaleString()} ₽`;
        }
    };
    
    // Конвертируем цену из рублей в выбранную валюту для отображения в input
    const getDisplayPrice = (priceInRub) => {
        const rate = exchangeRates[currency];
        return Math.round(priceInRub * rate);
    };
    
    // Конвертируем цену из выбранной валюты в рубли для сохранения
    const getPriceInRub = (priceInCurrency) => {
        const rate = exchangeRates[currency];
        return Math.round(priceInCurrency / rate);
    };
    
    useEffect(() => {
        setSkin(inSkin);
        setImagePreview(inSkin.imageUrl || null);
        setErrors({});
    }, [inSkin]);
    
    // Валидация формы
    const validateForm = () => {
        const newErrors = {};
        
        if (!skin.name?.trim()) {
            newErrors.name = 'Введите название скина';
        } else if (skin.name.length < 3) {
            newErrors.name = 'Название должно быть не менее 3 символов';
        }
        
        if (!skin.weapon) {
            newErrors.weapon = 'Выберите оружие';
        }
        
        const displayPrice = getDisplayPrice(skin.price || 0);
        if (!displayPrice || displayPrice <= 0) {
            newErrors.price = 'Цена должна быть больше 0';
        } else if (displayPrice > 100000000) {
            newErrors.price = 'Цена слишком высока (макс. 100,000,000)';
        }
        
        if (skin.imageUrl && !isValidUrl(skin.imageUrl)) {
            newErrors.imageUrl = 'Введите корректный URL изображения';
        }
        
        if (skin.float < 0 || skin.float > 1) {
            newErrors.float = 'Float должен быть от 0 до 1';
        }
        
        return newErrors;
    };
    
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };
    
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        
        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        if (name === 'price') {
            const priceInCurrency = parseInt(value) || 0;
            const priceInRub = getPriceInRub(priceInCurrency);
            
            setSkin({ 
                ...skin, 
                [name]: priceInRub
            });
        } else if (name === 'float') {
            const floatValue = parseFloat(value) || 0;
            setSkin({ 
                ...skin, 
                [name]: floatValue
            });
        } else {
            setSkin({ 
                ...skin, 
                [name]: type === 'checkbox' ? checked : value 
            });
        }
    };

    const handleImageUrlChange = (event) => {
        const { value } = event.target;
        if (errors.imageUrl) {
            setErrors(prev => ({ ...prev, imageUrl: '' }));
        }
        setSkin({ ...skin, imageUrl: value });
        setImagePreview(value);
    };
    
    const onSubmit = (event) => {
        event.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        // Добавляем ID владельца при создании нового скина
        const skinToSubmit = isEditing ? skin : {
            ...skin,
            ownerId: user?.id // Добавляем владельца при создании
        };
        
        handleSubmit(skinToSubmit);
        
        if (!isEditing) {
            // Сбрасываем форму только при успешном добавлении
            setSkin({
                name: "", 
                weapon: "", 
                quality: "Прямо с завода", 
                float: 0.00, 
                price: 0, 
                imageUrl: "",
                sticker: "Нет стикеров",
                statTrak: false,
                description: "",
                ownerId: user?.id
            });
            setImagePreview(null);
            setErrors({});
        }
    };
    
    // Отображаемая цена в текущей валюте
    const displayPrice = getDisplayPrice(skin.price || 0);
    
    // Проверяем, может ли пользователь редактировать форму
    const canEdit = !isEditing || isOwner;
    
    return (
        <div className="form-panel">
            <h3>{isEditing ? '✏️ Редактировать скин' : '➕ Добавить новый скин'}</h3>
            
            {isEditing && !isOwner && (
                <div className="warning-message">
                    ⚠️ Вы не можете редактировать этот лот, так как вы не его владелец
                </div>
            )}
            
            <form onSubmit={onSubmit} className="skin-form">
                <div className="form-group">
                    <label>Название скина *</label>
                    <input
                        type="text"
                        name="name"
                        value={skin.name}
                        onChange={handleChange}
                        disabled={!canEdit}
                        required
                        placeholder="AK-47 | Красная линия"
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                    <label>Оружие *</label>
                    <select 
                        name="weapon" 
                        value={skin.weapon} 
                        onChange={handleChange}
                        disabled={!canEdit}
                        required
                        className={errors.weapon ? 'error' : ''}
                    >
                        <option value="">Выберите оружие</option>
                        <option value="AK-47">AK-47</option>
                        <option value="AWP">AWP</option>
                        <option value="M4A4">M4A4</option>
                        <option value="M4A1-S">M4A1-S</option>
                        <option value="Desert Eagle">Desert Eagle</option>
                        <option value="Glock-18">Glock-18</option>
                        <option value="USP-S">USP-S</option>
                        <option value="P250">P250</option>
                        <option value="Tec-9">Tec-9</option>
                        <option value="Five-SeveN">Five-SeveN</option>
                        <option value="CZ75-Auto">CZ75-Auto</option>
                    </select>
                    {errors.weapon && <div className="error-message">{errors.weapon}</div>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Цена ({currency}) *</label>
                        <div className="price-input-wrapper">
                            <input
                                type="number"
                                name="price"
                                value={displayPrice}
                                onChange={handleChange}
                                disabled={!canEdit}
                                required
                                min="0"
                                max="100000000"
                                placeholder={currency === 'RUB' ? "10000" : currency === 'USD' ? "110" : "360"}
                                className={errors.price ? 'error' : ''}
                            />
                            <div className="currency-hint">
                                <small>
                                    {currency === 'RUB' ? '₽' : currency === 'USD' ? '$' : 'BYN'} 
                                    {currency !== 'RUB' && ` (${convertPriceForDisplay(skin.price || 0)})`}
                                </small>
                            </div>
                        </div>
                        {errors.price && <div className="error-message">{errors.price}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label>Float</label>
                        <input
                            type="number"
                            step="0.001"
                            name="float"
                            value={skin.float}
                            onChange={handleChange}
                            disabled={!canEdit}
                            min="0"
                            max="1"
                            placeholder="0.15"
                            className={errors.float ? 'error' : ''}
                        />
                        {errors.float && <div className="error-message">{errors.float}</div>}
                    </div>
                </div>

                <div className="form-group">
                    <label>URL изображения</label>
                    <input
                        type="url"
                        name="imageUrl"
                        value={skin.imageUrl}
                        onChange={handleImageUrlChange}
                        disabled={!canEdit}
                        placeholder="https://steamcommunity.com/image/..."
                        className={errors.imageUrl ? 'error' : ''}
                    />
                    {errors.imageUrl && <div className="error-message">{errors.imageUrl}</div>}
                    {imagePreview && (
                        <div className="image-preview-small">
                            <img src={imagePreview} alt="Предпросмотр" onError={(e) => {
                                e.target.style.display = 'none';
                            }} />
                        </div>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Качество</label>
                        <select 
                            name="quality" 
                            value={skin.quality} 
                            onChange={handleChange}
                            disabled={!canEdit}
                        >
                            <option value="Прямо с завода">Прямо с завода</option>
                            <option value="Немного поношенное">Немного поношенное</option>
                            <option value="Поношенное">Поношенное</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Стикеры</label>
                        <input
                            type="text"
                            name="sticker"
                            value={skin.sticker}
                            onChange={handleChange}
                            disabled={!canEdit}
                            placeholder="4x Starladder 2019"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Описание</label>
                    <textarea
                        name="description"
                        value={skin.description}
                        onChange={handleChange}
                        disabled={!canEdit}
                        placeholder="Описание скина..."
                        rows="3"
                    />
                </div>

                <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="statTrak"
                            checked={skin.statTrak}
                            onChange={handleChange}
                            disabled={!canEdit}
                        />
                        <span className="checkmark"></span>
                        StatTrak™
                    </label>
                </div>
                
                {canEdit && (
                    <div className="form-buttons">
                        <button type="submit" className="btn-submit">
                            {isEditing ? '💾 Сохранить изменения' : '🚀 Добавить скин'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={onCancel} className="btn-cancel">
                                ❌ Отмена
                            </button>
                        )}
                    </div>
                )}
                
                <div className="currency-info-form">
                    <small>
                        💱 Курсы: 1 RUB = {exchangeRates.USD} USD = {exchangeRates.BYN} BYN
                        <br/>
                        💡 Цена всегда сохраняется в рублях, а отображается в выбранной валюте
                        {isEditing && skin.ownerId && (
                            <><br/>👤 Владелец лота: {skin.ownerId === user?.id ? 'Вы' : 'Другой пользователь'}</>
                        )}
                    </small>
                </div>
            </form>
        </div>
    );
};

export default Form;