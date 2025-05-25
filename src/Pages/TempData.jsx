import React, { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export const TempData = () => {
    const [datos, setDatos] = useState([]);
    const [pagina, setPagina] = useState(1);
    const porPagina = 15;

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/temperaturas')
            .then(res => res.json())
            .then(setDatos);
    }, []);

    const totalPaginas = Math.ceil(datos.length / porPagina);
    const datosPagina = datos.slice((pagina - 1) * porPagina, pagina * porPagina);

    // Prepara los datos para la gráfica (puedes usar todos o solo los de la página actual)
    const datosGrafica = datos.map(dato => ({
        fecha: new Date(dato.fecha_hora).toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        temperatura: dato.temperatura
    }));

    return (
        <div className="flex flex-col items-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Tabla de Datos de Temperatura</h2>
            <p className="mb-4">Total de registros: {datos.length}</p>
            <p className="mb-4">Registro de temperatura CPU RaspberryPi 3</p>
            <table className="min-w-[300px] w-full max-w-3xl border border-gray-300 rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Fecha y Hora</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Temperatura</th>
                    </tr>
                </thead>
                <tbody>
                    {datosPagina.map((dato, idx) => (
                        <tr key={dato._id || idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                {new Date(dato.fecha_hora).toLocaleString('es-CL', {
                                    timeZone: 'America/Santiago',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{dato.temperatura}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Línea de tiempo */}
            <div className="w-full max-w-3xl mt-8 bg-white rounded shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Línea de tiempo de temperatura</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={datosGrafica.slice(-50)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Line type="monotone" dataKey="temperatura" stroke="#2563eb" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {/* Paginación */}
            <div className="flex gap-2 mt-4">
                <button
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    onClick={() => setPagina(pagina - 1)}
                    disabled={pagina === 1}
                >
                    Anterior
                </button>
                <span className="px-3 py-1">{pagina} / {totalPaginas}</span>
                <button
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    onClick={() => setPagina(pagina + 1)}
                    disabled={pagina === totalPaginas}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
