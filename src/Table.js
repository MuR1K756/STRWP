import React from "react";
import { 
  Table, 
  TableContainer, 
  Button, 
  TableBody, 
  TableRow, 
  TableHead, 
  Paper, 
  TableCell,
  IconButton,
  Typography 
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ClientTable = ({ clients, delClient, editClient }) => {

  if (!clients || clients.length === 0) {
    return (
      <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
        <Typography variant="h6" align="center">
          Клиенты не найдены
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" style={{ padding: '16px' }}>
        Список клиентов ({clients.length})
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Имя</strong></TableCell>
            <TableCell><strong>Фамилия</strong></TableCell>
            <TableCell><strong>Телефон</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Сумма покупок</strong></TableCell>
            <TableCell><strong>Действия</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} hover>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.surname}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.email || '-'}</TableCell>
              <TableCell>{client.totalPurchases ? `${client.totalPurchases} ₽` : '-'}</TableCell>
              <TableCell>
                <IconButton 
                  color="primary" 
                  onClick={() => editClient(client)}
                  size="small"
                  title="Редактировать"
                >
                  <Edit />
                </IconButton>
                <IconButton 
                  color="error" 
                  onClick={() => {
                    if (window.confirm(`Удалить клиента ${client.name} ${client.surname}?`)) {
                      delClient(client.id);
                    }
                  }}
                  size="small"
                  title="Удалить"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientTable;