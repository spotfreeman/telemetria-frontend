import React, { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { 
    ChartPieIcon, 
    CpuChipIcon, 
    FireIcon,
    ClockIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export const TempData = () => {
    const [datos, setDatos] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const porPagina = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('https://telemetria-backend.onrender.com/api/temperaturas');
                if (!response.ok) {
                    throw new Error('Error al cargar los datos');
                }
                const data = await response.json();
                setDatos(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching temperature data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
        }));

    const temperaturas = datos.map(d => d.temperatura);
    const max = temperaturas.length ? Math.max(...temperaturas) : '-';
    const min = temperaturas.length ? Math.min(...temperaturas) : '-';
    const avg = temperaturas.length
        ? (temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length).toFixed(2)
        : '-';


    const almacenamiento = datosOrdenados.length && datosOrdenados[0].almacenamiento !== undefined
        ? datosOrdenados[0].almacenamiento
        : '-';

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <ChartPieIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Cargando datos de telemetría...</h2>
                    <p className="text-gray-500">Obteniendo información del Raspberry Pi</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar datos</h2>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                        <CpuChipIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Telemetría Raspberry Pi
                    </h1>
                    <p className="text-gray-600 mt-2">Monitoreo en tiempo real de temperatura y almacenamiento</p>
                    <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            Actualización cada 60 minutos
                        </div>
                        <div className="flex items-center">
                            <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
                            {datos.length} registros totales
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <ArrowUpIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{max}°C</h3>
                        <p className="text-sm font-medium text-red-600">Temperatura Máxima</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <ArrowDownIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{min}°C</h3>
                        <p className="text-sm font-medium text-blue-600">Temperatura Mínima</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <FireIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{avg}°C</h3>
                        <p className="text-sm font-medium text-green-600">Temperatura Promedio</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <ChartPieIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{almacenamiento}%</h3>
                        <p className="text-sm font-medium text-purple-600">Almacenamiento Libre</p>
                    </div>
                </div>

                {/* Contenido Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tabla de Datos */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Registros Recientes</h2>
                            <div className="text-sm text-gray-500">
                                Página {pagina} de {totalPaginas}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-2 font-medium text-gray-600">Fecha y Hora</th>
                                        <th className="text-left py-3 px-2 font-medium text-gray-600">Temperatura</th>
                                        <th className="text-left py-3 px-2 font-medium text-gray-600">Almacenamiento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datosPagina.map((dato, idx) => (
                                        <tr key={dato._id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                                            <td className="py-3 px-2 text-sm text-gray-600">
                                                {new Date(dato.fecha_hora).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    {dato.temperatura}°C
                                                </span>
                                            </td>
                                            <td className="py-3 px-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {dato.almacenamiento} GB
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación Mejorada */}
                        <div className="flex items-center justify-between mt-6">
                            <button
                                onClick={() => setPagina(pagina - 1)}
                                disabled={pagina === 1}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                                Anterior
                            </button>

                            <div className="flex space-x-1">
                                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPagina(pageNum)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${pagina === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setPagina(pagina + 1)}
                                disabled={pagina === totalPaginas}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Siguiente
                                <ChevronRightIcon className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* Gráfico */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Tendencia de Temperatura</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={datosGrafica}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="fecha"
                                        interval="preserveStartEnd"
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                        fontSize={12}
                                        stroke="#6b7280"
                                    />
                                    <YAxis
                                        domain={['auto', 'auto']}
                                        fontSize={12}
                                        stroke="#6b7280"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="temperatura"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
