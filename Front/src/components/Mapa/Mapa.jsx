import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, Popup } from "react-leaflet";
import InsertChartOutlinedRoundedIcon from '@mui/icons-material/InsertChartOutlinedRounded';
import { NavLink } from 'react-router-dom';

//styles
import styles from "./Mapa.module.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { getTrial } from "services/getTrial";
import SensorCard from './Sensorcard';

const Mapa = () => {
  const [data, setData] = useState({});
  const position = [6.242391, -75.589642];
  const bounds = [
    [6.244529, -75.592128],
    [6.239687, -75.586238],
  ];

const getSensorData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/sensores'); // Asegúrate de que la URL es la correcta
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.statusText}`);
    }
    const sensorsData = await response.json();
    setData(sensorsData); // Actualiza el estado con los datos obtenidos
  } catch (error) {
      console.error("Error en getTrialData:", error);
  }
};
  
  
  useEffect(() => {
    getSensorData();
  }, []);

  function Boundaries() {
    const map = useMap();
    map.setMaxBounds(bounds);
  }

  const customIcon = new Icon({
    iconUrl: require("assets/Map_Popup_Icon.png"),
    iconSize: [30, 45]
  });

  return (
    <section className={styles.Wrapper}>
      <NavLink to={'/ecovilla'}>
        <button className={styles.openBocetoButton}><InsertChartOutlinedRoundedIcon /></button>
      </NavLink>

      <MapContainer
        bounds={bounds}
        zoom={20}
        zoomControl={true}
        scrollWheelZoom={false}
        className={styles.leafletContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>'
          url="https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png"
        />
      {data.length > 0 && data.map((sensor) => (
    <Marker
      key={sensor.id_sensor}
      icon={customIcon}
      position={[sensor.latitud, sensor.longitud]} // Usa la latitud y longitud de cada sensor
    >
      <Popup>
        <SensorCard sensor={sensor} /> {/* Pasa la info de cada sensor */}
      </Popup>
    </Marker>  
    ))}
        <Boundaries />
      </MapContainer>
    </section>
  );
};

export default Mapa;
