import React, { useState,useEffect } from 'react';
import SensorMeasurement from './Components/SensorMeasurement';
import SensorModal from './SensorModal';
import styles from './Admin.module.css';

function Admin() {
  const [temperatureCards, setTemperatureCards] = useState([]);
  const [humidityCards, setHumidityCards] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/sensores')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const temperatureSensors = data
          .filter(sensor => sensor.tipo === 'TEMPERATURA')
          .map(sensor => ({
            nombreId: sensor.nombre,
            ubicacion: sensor.ubicacion,
            estado: sensor.estado.toLowerCase(), // Ej. 'activo', 'inactivo'
            imagenurl: 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg'
          }));

        const humiditySensors = data
          .filter(sensor => sensor.tipo === 'HUMEDAD')
          .map(sensor => ({
            nombreId: sensor.nombre,
            ubicacion: sensor.ubicacion,
            estado: sensor.estado.toLowerCase(),
            imagenurl: 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg'
          }));

        setTemperatureCards(temperatureSensors);
        setHumidityCards(humiditySensors);
      })
      .catch(error => console.error('Error al obtener los datos:', error));
  }, []);

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

  const handleDeleteSensor = (nombreId) => {
    // Filtrar los sensores eliminando el que coincide con el nombreId
    const filterCards = (cards) => cards.filter((card) => card.nombreId !== nombreId);

    setTemperatureCards((prevCards) => filterCards(prevCards));
    setHumidityCards((prevCards) => filterCards(prevCards));
    
    handleCloseModal(); // Cerrar el modal después de eliminar
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
          handleDelete={handleDeleteSensor} 
        />
      )}
    </div>
  );
}

export default Admin;
