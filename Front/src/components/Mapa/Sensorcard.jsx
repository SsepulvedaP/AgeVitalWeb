import React from 'react';
import './Sensorcard.css';

function SensorCard({sensor}) {
    return (
        <div className="sensor-card">
            <div className="sensor-status">
                <span className="sensor-title">Sensor</span>
                <span className={`status-badge ${sensor.estado === 'Activo' ? 'activo' : sensor.estado === 'Dañado' ? 'dañado' : 'desactivado'}`}>
                    {sensor.estado === 'Activo' ? 'Activo' : sensor.estado === 'Dañado' ? 'Dañado' : 'Desactivado'}
                </span>
            </div>
            <h1 className="sensor-name">{sensor.tipo}</h1>
            <hr />
            <div className="sensor-info">
                <div className="info-row-sub">
                    <span>Medida</span>
                    <span>Max</span>
                    <span>Min</span>
                </div>
                <div className="info-row">
                    <span>70%</span>
                    <span>{sensor.medida_maxima}</span>
                    <span>{sensor.medida_minima}</span>
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
                    <p className="sensor-id"> {sensor.nombre}</p>
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
