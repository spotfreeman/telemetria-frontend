import React, { useEffect, useState } from 'react';

function DatosPage() {
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/temperaturas')
            .then(res => res.json())
            .then(setDatos);
    }, []);

    return (
        <div className="flex flex-col items-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Datos desde MongoDB</h2>
            <table className="min-w-[300px] w-1/2 border border-gray-300 rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Fecha y Hora</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Temperatura</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((dato, idx) => (
                        <tr key={dato._id} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{dato.fecha_hora}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{dato.temperatura}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DatosPage;