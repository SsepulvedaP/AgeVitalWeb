import React from 'react';
import './Dashboard.css';
import InsertChartOutlinedRoundedIcon from '@mui/icons-material/InsertChartOutlinedRounded';

const renderSensorMetrics = (sensorType, metrics) => (
    <div className={`${sensorType}-metrics`}>
        <h2>{sensorType === 'temperature' ? 'Temperatura' : 'Humedad'}</h2>
        <div className="metric-group">
            {metrics.map((metric, index) => (
                <div className="metric-card" key={`${sensorType}-${index}`}>
                    <h3>{metric.title}</h3>
                    <p>{metric.value}</p>
                </div>
            ))}
        </div>
    </div>
);

const Dashboard = () => {
    const openNewTab = () => {
        window.open('http://10.38.32.137:3000/d/de15iqdns3gu8f/age-sensors?orgId=1&refresh=auto', '_blank');
    };

    const temperatureMetrics = [
        { title: 'Promedio Global', value: '25°C' },
        { title: 'Máximo', value: '30°C' },
        { title: 'Mínimo', value: '20°C' },
        { title: 'Mediana', value: '25°C' },
    ];

    const humidityMetrics = [
        { title: 'Promedio Global', value: '45%' },
        { title: 'Máximo', value: '60%' },
        { title: 'Mínimo', value: '30%' },
        { title: 'Mediana', value: '47%' },
    ];

    return (
        <div className="dashboard-container">
            <button className="open-dashboard-button" onClick={openNewTab}><InsertChartOutlinedRoundedIcon /></button>
            <div className="header">
                <h1>Dashboard de Sensores</h1>
            </div>

            {/* Resumen de Métricas por Sensor */}
            <div className="summary-section">
                {renderSensorMetrics('temperature', temperatureMetrics)}
                {renderSensorMetrics('humidity', humidityMetrics)}
            </div>

            {/* Sección de Gráficos */}
            <div className="charts-section">
                <div className="chart-container">
                    <h2>Tendencia de Temperatura</h2>
                    <canvas id="temperatureChart" width="400" height="200"></canvas>
                </div>
                <div className="chart-container">
                    <h2>Tendencia de Humedad</h2>
                    <canvas id="humidityChart" width="400" height="200"></canvas>
                </div>
            </div>

            {/* Filtros de Exploración */}
            <div className="filters-section">
                <h3>Filtrar Datos</h3>
                <div className="filter-item">
                    <label>Ubicación:</label>
                    <select>
                        <option value="all">Todas</option>
                        <option value="ubicacion1">Ubicación 1</option>
                        <option value="ubicacion2">Ubicación 2</option>
                    </select>
                </div>
                <div className="filter-item">
                    <label>Fecha:</label>
                    <input type="date" />
                </div>
                <div className="filter-item">
                    <label>Tipo de Sensor:</label>
                    <select>
                        <option value="todos">Todos</option>
                        <option value="humedad">Humedad</option>
                        <option value="temperatura">Temperatura</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
