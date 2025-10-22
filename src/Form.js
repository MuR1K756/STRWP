import React from "react";
import { useState, useEffect } from "react";

const Form = ({ handleSubmit, inClient, isEditing, onCancel }) => {
    const [client, setClient] = useState(inClient);
  
    useEffect(() => {
      setClient(inClient);
    }, [inClient]);
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setClient({ ...client, [name]: value });
    };
  
    const onSubmit = (event) => {
      event.preventDefault();
      if (client.name && client.surname && client.phone) {
        handleSubmit(client);
        if (!isEditing) {
          setClient({name: "", surname: "", phone: "", email: "", totalPurchases: 0});
        }
      }
    };
  
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0', borderRadius: '5px' }}>
        <h3>{isEditing ? 'Редактировать клиента' : 'Добавить нового клиента'}</h3>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label>Имя *: </label>
            <input
              type="text"
              name="name"
              value={client.name}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          
          <div>
            <label>Фамилия *: </label>
            <input
              type="text"
              name="surname"
              value={client.surname}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          
          <div>
            <label>Телефон *: </label>
            <input
              type="text"
              name="phone"
              value={client.phone}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          
          <div>
            <label>Email: </label>
            <input
              type="email"
              name="email"
              value={client.email}
              onChange={handleChange}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          
          <div>
            <label>Сумма покупок (₽): </label>
            <input
              type="number"
              name="totalPurchases"
              value={client.totalPurchases}
              onChange={handleChange}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          
          <div>
            <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>
              {isEditing ? 'Обновить' : 'Добавить'}
            </button>
            {isEditing && (
              <button type="button" onClick={onCancel} style={{ padding: '8px 16px' }}>
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };
  
  export default Form;