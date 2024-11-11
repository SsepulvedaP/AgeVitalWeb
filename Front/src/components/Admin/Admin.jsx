import React, { useState,useEffect } from 'react';
import SensorMeasurement from './Components/SensorMeasurement';
import SensorModal from './Components/SensorModal';

//Services
import { getSensorData } from 'services/getSensorData';

//Styles
import styles from './Admin.module.css';
function Admin() {
  const [temperatureCards, setTemperatureCards] = useState([]);
  const [humidityCards, setHumidityCards] = useState([]);
  const [noiseCards, setNoiseCards] = useState([]); 
  const [airQualityCards, setAirQualityCards] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const image = 'https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg';

  useEffect(() => {
    getSensorData()
      .then(data => {
        const temperatureSensors = data
          .filter(sensor => sensor.tipo === 'temperatura')
          .map(sensor => ({
            nombreId: sensor.nombre,
            id_sensor: sensor.id_sensor,
            ubicacion:  `(${sensor.latitud}, ${sensor.longitud})`,
            estado: sensor.estado.toLowerCase(), 
            imagenurl: image
          }));

        const humiditySensors = data
          .filter(sensor => sensor.tipo === 'humedadrelativa')
          .map(sensor => ({
            nombreId: sensor.nombre,
            id_sensor: sensor.id_sensor,
            ubicacion:  `(${sensor.latitud}, ${sensor.longitud})`,
            estado: sensor.estado.toLowerCase(),
            imagenurl: image
          }));

        const noiseSensors = data
          .filter(sensor => sensor.tipo === 'ruido')
          .map(sensor => ({
            nombreId: sensor.nombre,
            id_sensor: sensor.id_sensor,
            ubicacion: `(${sensor.latitud}, ${sensor.longitud})`,
            estado: sensor.estado.toLowerCase(),
            imagenurl: image
          }));

        const airQualitySensors = data
        .filter(sensor => sensor.tipo === 'calidaddelaire')
        .map(sensor => ({
            nombreId: sensor.nombre,
            id_sensor: sensor.id_sensor,
            ubicacion: `(${sensor.latitud}, ${sensor.longitud})`,
            estado: sensor.estado.toLowerCase(),
            imagenurl: image
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
          id_sensor={selectedSensor.id_sensor}
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
