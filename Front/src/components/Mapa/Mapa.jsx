import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, Popup } from "react-leaflet";

//styles
import styles from "./Mapa.module.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { getTrial } from "services/getTrial";
import SensorCard from './Sensorcard'

const Mapa = () => {
  const [data, setData] = useState({});
  const position = [6.242391, -75.589642];
  const bounds = [
    [6.244529, -75.592128],
    [6.239687, -75.586238],
  ];

  const getTrialData = async () => {
    const data = await getTrial();
    setData(data);
  };
  useEffect(() => {
    getTrialData();
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
      <MapContainer
        bounds={bounds}
        zoom={20}
        zoomControl={false}
        scrollWheelZoom={false}
        className={styles["leaflet-container"]}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>'
          url="https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png"
        />
        <Marker icon={customIcon} position={position}>
          <Popup >
          <SensorCard />
          </Popup>
        </Marker>
        <Boundaries />
      </MapContainer>
    </section>
  );
};

export default Mapa;
