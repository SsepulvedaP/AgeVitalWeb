import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import styles from './LocationCard.module.css';

const getStatusClass = (status) => {
  switch (status) {
    case 'activo':
      return styles.activo; 
    case 'inactivo':
      return styles.inactivo; 
    case 'dañado':
      return styles.dañado;      
  }
};

const LocationCard = ({ nombreId, ubicacion, estado }) => {
  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
      <Box className={styles.header}>
          <Box>
            <Typography variant="h6" component="div">
              {nombreId}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {ubicacion}
            </Typography>
          </Box>
          
          <Box className={styles.flexContainer}>
            <Typography variant="body2" color="text.secondary" className={styles.marginRight}>
              {estado}
            </Typography>
            
            <Box className={`${styles.circle} ${getStatusClass(estado)}`} />
          </Box>
        </Box>
      </CardContent>
      
    </Card>
  );
};

export default LocationCard;

