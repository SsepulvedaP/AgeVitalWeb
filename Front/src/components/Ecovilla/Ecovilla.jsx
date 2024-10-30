import React, { useState } from 'react';
import './Ecovilla.css';

const planosData = {
    primerPiso: [
        { id: 1, top: '90px', left: '40px' }, // Sensor en la división
        { id: 2, top: '150px', left: '140px' }, // Sensor en la habitación
    ],
    segundoPiso: [
        { id: 3, top: '70px', left: '150px' },
        { id: 4, top: '200px', left: '250px' },
    ],
};

const Piso = ({ piso, sensores }) => {
    return (
        <div className={`piso ${piso}`}>
            <h2>{piso === 'primerPiso' ? 'Primer Piso' : 'Segundo Piso'}</h2>
            {sensores.map(sensor => (
                <div
                    key={sensor.id}
                    className="sensor"
                    style={{ top: sensor.top, left: sensor.left }}
                />
            ))}
        </div>
    );
};

const Ecovilla = () => {
    const [pisoActual, setPisoActual] = useState('primerPiso');

    return (
        <div className="container">
            <h1 >Boceto de Planos</h1>
            <button onClick={() => setPisoActual('primerPiso')}>Primer Piso</button>
            <button onClick={() => setPisoActual('segundoPiso')}>Segundo Piso</button>
            <Piso piso={pisoActual} sensores={planosData[pisoActual]} />
        </div>
    );
};

export default Ecovilla;
