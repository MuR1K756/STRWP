class ClientAPI {
  constructor() {
    
    this.clients = JSON.parse(localStorage.getItem('electronicsShopClients')) || [
      {
        id: 1,
        name: "Иван",
        surname: "Петров",
        phone: "+7 (912) 345-67-89",
        email: "ivan@mail.ru",
        totalPurchases: 45000
      },
      {
        id: 2,
        name: "Мария",
        surname: "Сидорова",
        phone: "+7 (923) 456-78-90",
        email: "maria@gmail.com",
        totalPurchases: 120000
      },
      {
        id: 3,
        name: "Алексей",
        surname: "Козлов",
        phone: "+7 (934) 567-89-01",
        email: "alex@yandex.ru",
        totalPurchases: 78000
      }
    ];
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('electronicsShopClients', JSON.stringify(this.clients));
  }

  all() {
    return this.clients;
  }

  add(client) {
    const newClient = {
      ...client,
      id: Date.now(), // Простой способ генерации ID
      totalPurchases: parseInt(client.totalPurchases) || 0
    };
    this.clients.push(newClient);
    this.saveToStorage();
    return newClient;
  }

  update(client) {
    const index = this.clients.findIndex(c => c.id === client.id);
    if (index !== -1) {
      this.clients[index] = {
        ...client,
        totalPurchases: parseInt(client.totalPurchases) || 0
      };
      this.saveToStorage();
      return this.clients[index];
    }
    return null;
  }

  delete(id) {
    const initialLength = this.clients.length;
    this.clients = this.clients.filter(client => client.id !== id);
    this.saveToStorage();
    return this.clients.length !== initialLength;
  }

  find(id) {
    return this.clients.find(client => client.id === id);
  }
}

// Экспортируем экземпляр класса
export default new ClientAPI();