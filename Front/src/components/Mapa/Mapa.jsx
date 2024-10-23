import React, { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, Popup } from "react-leaflet";

//styles
import styles from "./Mapa.module.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

const Mapa = () => {
  const position = [6.242391, -75.589642];
  const bounds = [
    [6.244529, -75.592128],
    [6.239687, -75.586238],
  ];

  function Boundaries() {
    const map = useMap();
    map.setMaxBounds(bounds);
  }

  const customIcon = new Icon({
    iconUrl: require("assets/Map_Popup_Icon.png"),
    iconSize: [30,45]
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
          <Popup className={styles["request-popup"]}>
            <p>Sensor Humedad</p>
            <ul>
              <li>80 g/m3</li>
              <li>27/09/24 16:18:20</li>
              <li>Ubicación</li>
            </ul>
          </Popup>
        </Marker>
        <Boundaries />
      </MapContainer>
    </section>
  );
};

export default Mapa;