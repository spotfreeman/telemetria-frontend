import React, { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export const TempData = () => {
    const [datos, setDatos] = useState([]);
    const [pagina, setPagina] = useState(1);
    const porPagina = 10;

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/temperaturas')
            .then(res => res.json())
            .then(setDatos);
    }, []);

    const totalPaginas = Math.ceil(datos.length / porPagina);
    const datosOrdenados = datos.slice().sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
    const datosPagina = datosOrdenados.slice((pagina - 1) * porPagina, pagina * porPagina);

    // Prepara los datos para la gráfica (sin modificar la hora)
    const datosGrafica = datos
        .slice()
        .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))
        .slice(0, 100)
        .reverse()
        .map(dato => ({
            fecha: dato.fecha_hora,
            temperatura: dato.temperatura,
            almacenamiento: dato.almacenamiento
        }));

    const temperaturas = datos.map(d => d.temperatura);
    const max = temperaturas.length ? Math.max(...temperaturas) : '-';
    const min = temperaturas.length ? Math.min(...temperaturas) : '-';
    const avg = temperaturas.length
        ? (temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length).toFixed(2)
        : '-';

    return (
        <div className="flex flex-col items-center mt-8 w-full">
            <h2 className="text-2xl font-bold mb-4">Temperatura CPU RaspberryPi 3</h2>
            <p className="mb-4">Total de registros: {datos.length}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full max-w-6xl">
                <div className="bg-white rounded shadow p-4 text-center">
                    <div className="text-sm text-gray-500">Máxima</div>
                    <div className="text-2xl font-bold text-red-600">{max}°C</div>
                </div>
                <div className="bg-white rounded shadow p-4 text-center">
                    <div className="text-sm text-gray-500">Mínima</div>
                    <div className="text-2xl font-bold text-blue-600">{min}°C</div>
                </div>
                <div className="bg-white rounded shadow p-4 text-center">
                    <div className="text-sm text-gray-500">Promedio</div>
                    <div className="text-2xl font-bold text-green-600">{avg}°C</div>
                </div>
                <div className="bg-white rounded shadow p-4 text-center">
                    <div className="text-sm text-gray-500">Almacenamiento</div>
                    <div className="text-2xl font-bold text-green-600">{almacenamiento} %</div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
                {/* Columna izquierda: Tabla */}
                <div className="flex-1">
                    <table className="min-w-[300px] w-full border border-gray-300 rounded-lg overflow-hidden shadow">
                        <thead>
                            <tr className="bg-blue-700 text-white">
                                <th className="px-4 py-2 border-b border-gray-300 text-center">Fecha y Hora</th>
                                <th className="px-4 py-2 border-b border-gray-300 text-center">Temperatura</th>
                                <th className="px-4 py-2 border-b border-gray-300 text-center">Almacenamiento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosPagina.map((dato, idx) => (
                                <tr key={dato._id || idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                    <td className="px-4 py-2 text-center border-b border-gray-300">{dato.fecha_hora}</td>
                                    <td className="px-4 py-2 text-center border-b border-gray-300">{dato.temperatura}</td>
                                    <td className="px-4 py-2 text-center border-b border-gray-300">{dato.almacenamiento} %</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="flex gap-2 mt-4 justify-center">
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

                {/* Columna derecha: Gráfico */}
                <div className="flex-1 flex flex-col">
                    <div className="bg-white rounded shadow p-4 flex-1">
                        <h3 className="text-lg font-semibold mb-2">Línea de tiempo de temperatura</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={datosGrafica}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="fecha"
                                    interval="preserveStartEnd"
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="temperatura" stroke="#2563eb" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
