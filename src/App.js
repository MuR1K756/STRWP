import './App.css';
import ClientAPI from "./api/services";
import Table from "./Table";
import Form from "./Form";
import { useState } from "react";

const initialClients = ClientAPI.all();

function App() {
  const [clients, setClients] = useState(initialClients);
  const [editingClient, setEditingClient] = useState(null);

  const delClient = (id) => {
    if (ClientAPI.delete(id)) {
      setClients(clients.filter((client) => client.id !== id));
    }
  };

  const addClient = (client) => {
    const newClient = ClientAPI.add(client);
    if(newClient) {
      setClients([...clients, newClient]);
    }
  };

  const updateClient = (client) => {
    const updatedClient = ClientAPI.update(client);
    if(updatedClient) {
      setClients(clients.map(c => c.id === client.id ? updatedClient : c));
      setEditingClient(null);
    }
  };

  const startEdit = (client) => {
    setEditingClient(client);
  };

  const cancelEdit = () => {
    setEditingClient(null);
  };

  return (
    <div className="App">
      <h1>Клиентская база интернет-магазина электроники</h1>
      
      <Form 
        handleSubmit={editingClient ? updateClient : addClient}
        inClient={editingClient || {name: "", surname: "", phone: "", email: "", totalPurchases: 0}}
        isEditing={!!editingClient}
        onCancel={cancelEdit}
      />
      
      <Table 
        clients={clients} 
        delClient={delClient}
        editClient={startEdit}
      />
    </div>
  );
}

export default App;