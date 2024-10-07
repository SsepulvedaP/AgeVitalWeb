import React, { useState } from 'react';
import SensorMeasurement from './Components/SensorMeasurement';
import SensorModal from './SensorModal';
import styles from './Admin.module.css';

function Admin() {
  const [temperatureCards, setTemperatureCards] = useState([
    { nombreId: 'ID_12345', ubicacion: 'Edificio A', estado: 'activo', imagenurl: 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg' },
    { nombreId: 'ID_67890', ubicacion: 'Edificio B', estado: 'inactivo', imagenurl: 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg' },
    { nombreId: 'ID_11121', ubicacion: 'Edificio C', estado: 'dañado', imagenurl: 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg' }
  ]);

  const [humidityCards, setHumidityCards] = useState([
    { nombreId: 'ID_54321', ubicacion: 'Edificio D', estado: 'activo', imagenurl: 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg' },
    { nombreId: 'ID_98765', ubicacion: 'Edificio E', estado: 'inactivo', imagenurl: 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg' }
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);

  const handleOpenModal = (sensor) => {
    setSelectedSensor(sensor);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSensor(null);
  };

  const handleUpdateSensor = (updatedSensor) => {
    const updateCards = (cards) =>
      cards.map((card) =>
        card.nombreId === updatedSensor.nombreId ? updatedSensor : card
      );
  
    setTemperatureCards((prevCards) => updateCards(prevCards));
    setHumidityCards((prevCards) => updateCards(prevCards));
    
    handleCloseModal();
  };

  return (
    <div className={styles.measurement}>
      {/* Componente que muestra las tarjetas de temperatura */}
      <SensorMeasurement 
        titulo="Temperatura" 
        cardsData={temperatureCards} 
        handleOpenModal={handleOpenModal} 
      />

      {/* Componente que muestra las tarjetas de humedad */}
      <SensorMeasurement 
        titulo="Humedad" 
        cardsData={humidityCards} 
        handleOpenModal={handleOpenModal} 
      />

      {/* Modal para editar el sensor */}
      {selectedSensor && (
        <SensorModal 
          open={openModal} 
          handleClose={handleCloseModal} 
          nombreId={selectedSensor.nombreId}
          ubicacion={selectedSensor.ubicacion}
          estado={selectedSensor.estado}
          imagenurl={selectedSensor.imagenurl}
          handleUpdate={handleUpdateSensor}
        />
      )}
    </div>
  );
}

export default Admin;
