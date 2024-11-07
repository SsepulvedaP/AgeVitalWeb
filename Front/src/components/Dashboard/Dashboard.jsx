import React from 'react';
import './Dashboard.css';
import InsertChartOutlinedRoundedIcon from '@mui/icons-material/InsertChartOutlinedRounded';
import { LineChart } from '@mui/x-charts';

// Función para formatear la fecha en MM/DD
const formatDate = (date) => {
    const month = date.getMonth() + 1; // Los meses son 0-indexados, por eso se suma 1
    const day = date.getDate();
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
};

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

const timeData = [
    new Date(2024, 7, 31),
    new Date(2024, 7, 31, 12),
    new Date(2024, 8, 1),
    new Date(2024, 8, 1, 12),
    new Date(2024, 8, 2),
    new Date(2024, 8, 2, 12),
    new Date(2024, 8, 3),
    new Date(2024, 8, 3, 12),
    new Date(2024, 8, 4),
];

const xAxisCommon = {
    data: timeData,
    scaleType: 'time',
    tickFormatter: (value) => formatDate(new Date(value)), // Aplica el formato MM/DD
};

const renderCharts = (chartData) => (
    chartData.map((chart, index) => (
        <div className="chart-container" key={`chart-${index}`}>
            <h2>{chart.title}</h2>
            <LineChart
                xAxis={[{
                    ...xAxisCommon,
                    tickMinStep: 3600 * 1000 * 24, // min step: 24h
                }]}
                series={chart.series}
                width={chart.width || 500}
                height={chart.height || 300}
            />
        </div>
    ))
);

const Dashboard = () => {
    const openNewTab = () => {
        window.open('http://10.38.32.137:3000/d/de15iqdns3gu8f/age-sensors?orgId=1&refresh=auto', '_blank');
    };

    const temperatureMetrics = [
        { title: 'Promedio Global', value: '24.3°C' },
        { title: 'Máximo', value: '32.1°C' },
        { title: 'Mínimo', value: '18.7°C' },
        { title: 'Mediana', value: '24.0°C' },
    ];

    const humidityMetrics = [
        { title: 'Promedio Global', value: '50.6%' },
        { title: 'Máximo', value: '68.4%' },
        { title: 'Mínimo', value: '35.2%' },
        { title: 'Mediana', value: '51.0%' },
    ];

    const chartData = [
        {
            title: 'Tendencia de Temperatura',
            xAxisData: timeData,
            series: [{ data: [2, 5.5, 2, 8.5, 1.5, 5] }],
        },
        {
            title: 'Tendencia de Humedad',
            xAxisData: ['01:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
            series: [{ data: [62, 59, 55, 50, 45, 47, 53, 60] }],
        },
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
                {renderCharts(chartData)}
            </div>
        </div>
    );
};

export default Dashboard;
