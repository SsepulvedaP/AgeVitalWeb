import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

//styles
import styles from "./Mapa.module.css";
import "leaflet/dist/leaflet.css";

const Mapa = () => {
  const position = [6.242391, -75.589642];

  return (
    <section className={styles.Wrapper}>
      <MapContainer center={position} zoom={20} scrollWheelZoom className={styles['leaflet-container']}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </section>
  );
};

export default Mapa;
