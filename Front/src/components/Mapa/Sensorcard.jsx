import React from 'react';
import './Sensorcard.css';

function SensorCard() {
    return (
        <div className="sensor-card">
            <div className="sensor-status">
                <span className="sensor-title">Sensor</span>
                <span className="status-badge">Activo
                </span>
            </div>
            <h1 className="sensor-name">Humedad</h1>
            <hr />
            <div className="sensor-info">
                <div className="info-row-sub">
                    <span>Medida</span>
                    <span>Max</span>
                    <span>Min</span>
                </div>
                <div className="info-row">
                    <span>70%</span>
                    <span>100%</span>
                    <span>0%</span>
                </div>
                <div className="info-row-sub">
                    <span>Fecha</span>
                    <span>Frecuencia</span>
                    <span>Hora</span>
                </div>
                <div className="info-row">
                    <span>2024-03-02</span>
                    <span>5min</span>
                    <span>3:06</span>
                </div>
                <div className="info-row-id">
                    <p className="sensor-id-tittle">Id del sensor: </p>
                    <p className="sensor-id"> 51588</p>
                </div>

            </div>
            <div className="decorative-circles">
                <div className="circle large"></div>
                <div className="circle small"></div>
            </div>
        </div>
    );
}

export default SensorCard;
