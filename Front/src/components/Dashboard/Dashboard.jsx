import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import InsertChartOutlinedRoundedIcon from '@mui/icons-material/InsertChartOutlinedRounded';
import { LineChart } from '@mui/x-charts';

// Función para formatear la fecha en MM/DD
const formatDate = (date) => {
    const month = date.getMonth() + 1; // Los meses son 0-indexados, por eso se suma 1
    const day = date.getDate();
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
};

const formatSensorType = (sensorType) => {
    switch(sensorType) {
        case 'temperatura':
            return 'Temperatura';
        case 'humedadrelativa':
            return 'Humedad Relativa';
        case 'ruido':
            return 'Ruido';
        // Agrega más casos si es necesario
        default:
            return sensorType;
    }
};

const renderSensorMetrics = (sensorType, metrics) => (
    <div className={`${sensorType}-metrics`} key={sensorType}>
        <h2>{formatSensorType(sensorType)}</h2>
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

const renderCharts = (chartData) => (
    chartData.map((chart, index) => (
        <div className="chart-container" key={`chart-${index}`}>
            <h2>{chart.title}</h2>
            <LineChart
                xAxis={[{
                    data: chart.xAxisData,
                    scaleType: 'time',
                    tickFormatter: (value) => formatDate(new Date(value)),
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
    const [metricsData, setMetricsData] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://10.38.32.137:5000/api/globalmetrics');
                const data = await response.json();
                // Filtrar los datos para obtener solo aquellos con valores no nulos
                const filteredData = data.filter(metric => metric.maxima !== null && metric.minima !== null && metric.promedio !== null);
                setMetricsData(filteredData);

                // Preparar datos para los gráficos
                const charts = filteredData.map(metric => {
                    // Simular datos de serie temporal para el gráfico
                    const now = new Date();
                    const dates = [];
                    for(let i = 6; i >= 0; i--) {
                        const date = new Date(now);
                        date.setDate(now.getDate() - i);
                        dates.push(date);
                    }

                    // Simular valores alrededor del promedio
                    const min = parseFloat(metric.minima);
                    const max = parseFloat(metric.maxima);
                    const values = dates.map(() => {
                        // Valor aleatorio entre min y max
                        return (Math.random() * (max - min) + min).toFixed(2);
                    });

                    return {
                        title: `Tendencia de ${formatSensorType(metric.tipo_medicion)}`,
                        xAxisData: dates,
                        series: [{ data: values }],
                    };
                });
                setChartData(charts);

            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
        fetchData();
    }, []);

    const openNewTab = () => {
        window.open('http://10.38.32.137:3000/d/de15iqdns3gu8f/age-sensors?orgId=1&refresh=auto', '_blank');
    };

    return (
        <div className="dashboard-container">
            <button className="open-dashboard-button" onClick={openNewTab}>
                <InsertChartOutlinedRoundedIcon />
            </button>
            <div className="header">
                <h1>Dashboard de Sensores</h1>
            </div>

            {/* Resumen de Métricas por Sensor */}
            <div className="summary-section">
                {metricsData.map(metricData => {
                    const sensorType = metricData.tipo_medicion;
                    const metrics = [
                        { title: 'Promedio Global', value: `${parseFloat(metricData.promedio).toFixed(2)}` },
                        { title: 'Máximo', value: `${parseFloat(metricData.maxima).toFixed(2)}` },
                        { title: 'Mínimo', value: `${parseFloat(metricData.minima).toFixed(2)}` },
                    ];
                    return renderSensorMetrics(sensorType, metrics);
                })}
            </div>

            {/* Sección de Gráficos */}
            <div className="charts-section">
                {renderCharts(chartData)}
            </div>
        </div>
    );
};

export default Dashboard;
