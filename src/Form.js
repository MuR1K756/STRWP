import React from "react";
import { useState, useEffect } from "react";

const Form = ({ handleSubmit, inSkin, isEditing, onCancel }) => {
    const [skin, setSkin] = useState(inSkin);
  
    useEffect(() => {
      setSkin(inSkin);
    }, [inSkin]);
  
    const handleChange = (event) => {
      const { name, value, type, checked } = event.target;
      setSkin({ 
        ...skin, 
        [name]: type === 'checkbox' ? checked : value 
      });
    };
  
    const onSubmit = (event) => {
      event.preventDefault();
      if (skin.name && skin.weapon && skin.price) {
        handleSubmit(skin);
        if (!isEditing) {
          setSkin({
            name: "", 
            weapon: "", 
            quality: "Прямо с завода", 
            float: 0.00, 
            price: 0, 
            imageUrl: "",
            condition: "Прямо с завода",
            sticker: "Нет стикеров",
            statTrak: false,
            description: "",
            marketUrl: ""
          });
        }
      } else {
        alert('Заполните обязательные поля: название, оружие и цена');
      }
    };
  
    return (
      <div className="form-panel">
        <h3>{isEditing ? '✏️ Редактировать скин' : '➕ Добавить новый скин'}</h3>
        
        <form onSubmit={onSubmit} className="skin-form">
          <div className="form-group">
            <label>Название скина *</label>
            <input
              type="text"
              name="name"
              value={skin.name}
              onChange={handleChange}
              required
              placeholder="AK-47 | Красная линия"
            />
          </div>

          <div className="form-group">
            <label>Оружие *</label>
            <select name="weapon" value={skin.weapon} onChange={handleChange} required>
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
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Цена (₽) *</label>
              <input
                type="number"
                name="price"
                value={skin.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="10000"
              />
            </div>
            
            <div className="form-group">
              <label>Float</label>
              <input
                type="number"
                step="0.001"
                name="float"
                value={skin.float}
                onChange={handleChange}
                min="0"
                max="1"
                placeholder="0.15"
              />
            </div>
          </div>

          <div className="form-group">
            <label>URL изображения</label>
            <input
              type="url"
              name="imageUrl"
              value={skin.imageUrl}
              onChange={handleChange}
              placeholder="https://steamcommunity.com/image/..."
            />
            <small className="input-hint">
              Ссылка на изображение скина из Steam Market
            </small>
          </div>

          <div className="form-group">
            <label>URL Steam Market</label>
            <input
              type="url"
              name="marketUrl"
              value={skin.marketUrl}
              onChange={handleChange}
              placeholder="https://steamcommunity.com/market/listings/730/..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Качество</label>
              <select name="quality" value={skin.quality} onChange={handleChange}>
                <option value="Прямо с завода">Прямо с завода</option>
                <option value="Немного поношенное">Немного поношенное</option>
                <option value="Поношенное">Поношенное</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Состояние</label>
              <select name="condition" value={skin.condition} onChange={handleChange}>
                <option value="Прямо с завода">Прямо с завода</option>
                <option value="После полевых испытаний">После полевых испытаний</option>
                <option value="Полевое испытание">Полевое испытание</option>
                <option value="Поношенное">Поношенное</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Стикеры</label>
            <input
              type="text"
              name="sticker"
              value={skin.sticker}
              onChange={handleChange}
              placeholder="4x Starladder 2019"
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={skin.description}
              onChange={handleChange}
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
              />
              <span className="checkmark"></span>
              StatTrak™
            </label>
          </div>
          
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
        </form>
      </div>
    );
  };
  
  export default Form;