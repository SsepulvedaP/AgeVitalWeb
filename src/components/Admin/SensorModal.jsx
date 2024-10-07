import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, TextField, Select, MenuItem, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './SensorModal.module.css';

const SensorModal = ({ open, handleClose, nombreId, ubicacion, estado, imagenurl, handleUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUbicacion, setEditedUbicacion] = useState(ubicacion);
  const [editedEstado, setEditedEstado] = useState(estado);

  const handleSave = () => {
    if (handleUpdate) {
      handleUpdate({
        nombreId,
        ubicacion: editedUbicacion,
        estado: editedEstado,
        imagenurl,
      });
      setIsEditing(false);
    } else {
      console.error("handleUpdate is not defined");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUbicacion(ubicacion);
    setEditedEstado(estado);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Box className={styles.header}>
        <DialogTitle>Detalles del Sensor</DialogTitle>
        <IconButton className={styles.closeButton} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent>
        <Box className={styles.container}>
          <Box className={styles.imageContainer}>
            <img src={imagenurl} alt={nombreId} className={styles.image} />
          </Box>

          <Box className={styles.detailsContainer}>
            <Typography variant="h6">{nombreId}</Typography>

            <Box className={styles.details}>
              <Typography variant="body2">Ubicación:</Typography>
              {isEditing ? (
                <TextField 
                  value={editedUbicacion} 
                  onChange={(e) => setEditedUbicacion(e.target.value)} 
                  fullWidth 
                />
              ) : (
                <Typography>{ubicacion}</Typography>
              )}
            </Box>

            <Box className={styles.details}>
              <Typography variant="body2">Estado:</Typography>
              {isEditing ? (
                <Select
                  value={editedEstado}
                  onChange={(e) => setEditedEstado(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                  <MenuItem value="dañado">Dañado</MenuItem>
                </Select>
              ) : (
                <Typography>{estado}</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        {isEditing ? (
          <>
            <Button onClick={handleCancel} className={styles.buttonPurple}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className={styles.buttonPurple}>
              Guardar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)} className={styles.buttonPurple}>
              Modificar
            </Button>
            <Button className={styles.buttonPurple}>
              Eliminar
            </Button>
          </>
          
        )}
        
      </DialogActions>
        
    </Dialog>
  );
};


export default SensorModal;
