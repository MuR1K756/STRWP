import React from 'react';
import { useAppSelector } from '../hooks/redux';
import { Container, Typography, Box } from '@mui/material';
import WeaponsGrid from '../components/WeaponsGrid';

const CategoryPage = ({ type, title, icon }) => {
  
  const allSkins = useAppSelector(state => state.skins.items || []);

  
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '40px',
    marginTop: '20px'
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
      <Box sx={headerStyle}>
        <Typography variant="h2" component="span">
          {icon}
        </Typography>
        <Typography variant="h3" sx={{ 
          fontWeight: 'bold', 
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          {title}
        </Typography>
      </Box>

      
      <WeaponsGrid skins={allSkins} type={type} />
    </Container>
  );
};

export default CategoryPage;