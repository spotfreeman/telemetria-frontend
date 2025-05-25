import React, { useEffect, useState } from 'react';

function DatosPage() {
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/temperaturas')
            .then(res => res.json())
            .then(setDatos);
    }, []);

    const thTdStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'center'
    };

    return (
        <div>
            <h2>Datos desde MongoDB</h2>
            <table style={{
                width: '50%',
                margin: 'auto',
                borderCollapse: 'collapse',
                marginTop: '20px'
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                        <th style={thTdStyle}>Fecha y Hora</th>
                        <th style={thTdStyle}>Temperatura</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((dato, idx) => (
                        <tr key={dato._id} style={{ backgroundColor: idx % 2 === 0 ? '#f2f2f2' : '#ffffff' }}>
                            <td style={thTdStyle}>{dato.fecha_hora}</td>
                            <td style={thTdStyle}>{dato.temperatura}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DatosPage;