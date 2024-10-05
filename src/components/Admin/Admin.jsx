import React from 'react'
import SensorMeasurement from './Components/SensorMeasurement';
import styles from './Admin.module.css'

function Admin() {
  // Datos de ejemplo para las tarjetas
  const temperatureCards = [
    { nombreId: 'ID_12345', ubicacion: 'Edificio A', estado: 'activo' },
    { nombreId: 'ID_67890', ubicacion: 'Edificio B', estado: 'inactivo' },
    { nombreId: 'ID_11121', ubicacion: 'Edificio C', estado: 'dañado' },
    { nombreId: 'ID_11121', ubicacion: 'Edificio C', estado: 'dañado' },
    { nombreId: 'ID_11121', ubicacion: 'Edificio C', estado: 'dañado' },
    { nombreId: 'ID_11121', ubicacion: 'Edificio C', estado: 'dañado' },
    { nombreId: 'ID_11121', ubicacion: 'Edificio C', estado: 'dañado' },
    { nombreId: 'ID_11121', ubicacion: 'Edificio C', estado: 'dañado' },

  ];

  const humidityCards = [
    { nombreId: 'ID_54321', ubicacion: 'Edificio D', estado: 'activo' },
    { nombreId: 'ID_98765', ubicacion: 'Edificio E', estado: 'inactivo' },
    // Agrega más datos si es necesario
  ];
  return (
    <div className={styles.measurement}>
      <SensorMeasurement titulo="Temperatura" cardsData={temperatureCards} />
      <SensorMeasurement titulo="Humedad" cardsData={humidityCards} />
    </div>
  );
}

export default Admin;