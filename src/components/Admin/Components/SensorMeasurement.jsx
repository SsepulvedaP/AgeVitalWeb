import React from 'react';
import LocationCard from './LocationCard'; 
import styles from './SensorMeasurement.module.css'; 

const SensorMeasurement = ({ titulo, cardsData }) => {
  return (
    <div className={styles.sensorMeasurement}>

      <h2 className={styles.title}>{titulo}</h2>

      <div className={styles.cardsRow}>
        {cardsData.map((card) => (
          <LocationCard
            nombreId={card.nombreId}
            ubicacion={card.ubicacion}
            estado={card.estado}
          />
        ))}
      </div>
    </div>
  );
};

export default SensorMeasurement;
