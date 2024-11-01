import React, { useState,useEffect } from 'react';
import SensorMeasurement from './Components/SensorMeasurement';
import SensorModal from './SensorModal';
import styles from './Admin.module.css';

function Admin() {
  const [temperatureCards, setTemperatureCards] = useState([]);
  const [humidityCards, setHumidityCards] = useState([]);
  const [noiseCards, setNoiseCards] = useState([]); 
  const [airQualityCards, setAirQualityCards] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/sensores')
      .then(response => response.json())
      .then(data => {
        const temperatureSensors = data
          .filter(sensor => sensor.tipo === 'TEMPERATURA')
          .map(sensor => ({
            nombreId: sensor.nombre,
            ubicacion:  `(${sensor.latitud}, ${sensor.longitud})`,
            estado: sensor.estado.toLowerCase(), 
            imagenurl: 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg'
          }));

        const humiditySensors = data
          .filter(sensor => sensor.tipo === 'HUMEDAD')
          .map(sensor => ({
            nombreId: sensor.nombre,
            ubicacion:  `(${sensor.latitud}, ${sensor.longitud})`,
            estado: sensor.estado.toLowerCase(),
            imagenurl: 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg'
          }));

        const noiseSensors = data
          .filter(sensor => sensor.tipo === 'RUIDO')
          .map(sensor => ({
            nombreId: sensor.nombre,
            ubicacion: `(${sensor.latitud}, ${sensor.longitud})`,
            estado: sensor.estado.toLowerCase(),
            imagenurl: 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg'
          }));

        const airQualitySensors = data
        .filter(sensor => sensor.tipo === 'CALIDAD_DEL_AIRE')
        .map(sensor => ({
            nombreId: sensor.nombre,
            ubicacion: `(${sensor.latitud}, ${sensor.longitud})`,
            estado: sensor.estado.toLowerCase(),
            imagenurl: 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg'
          }));

        setTemperatureCards(temperatureSensors);
        setHumidityCards(humiditySensors);
        setNoiseCards(noiseSensors);
        setAirQualityCards(airQualitySensors);
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
    setNoiseCards((prevCards) => updateCards(prevCards));
    setAirQualityCards((prevCards) => updateCards(prevCards));

    handleCloseModal();
  };

  const handleDeleteSensor = (nombreId) => {
    const filterCards = (cards) => cards.filter((card) => card.nombreId !== nombreId);

    setTemperatureCards((prevCards) => filterCards(prevCards));
    setHumidityCards((prevCards) => filterCards(prevCards));
    setNoiseCards((prevCards) => filterCards(prevCards));
    setAirQualityCards((prevCards) => filterCards(prevCards));
    
    handleCloseModal(); 
  };

  return (
    <div className={styles.measurement}>
      <SensorMeasurement 
        titulo="Temperatura" 
        cardsData={temperatureCards} 
        handleOpenModal={handleOpenModal} 
      />

      <SensorMeasurement 
        titulo="Humedad" 
        cardsData={humidityCards} 
        handleOpenModal={handleOpenModal} 
      />
      <SensorMeasurement
        titulo="Ruido"
        cardsData={noiseCards}
        handleOpenModal={handleOpenModal}
      />

      <SensorMeasurement
        titulo="Calidad del Aire"
        cardsData={airQualityCards}
        handleOpenModal={handleOpenModal}
      />

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
