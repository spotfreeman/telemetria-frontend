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
import { motion } from "framer-motion";
import { MainLoading, ChartLoading, TableLoading } from "../Components/LoadingStates";

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

                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error('No hay token de autenticación. Por favor, inicia sesión.');
                }

                console.log('Token encontrado:', token ? 'Sí' : 'No');
                console.log('Haciendo request a:', 'https://telemetria-backend.onrender.com/api/temperaturas');

                const response = await fetch('https://telemetria-backend.onrender.com/api/temperaturas', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);

                if (!response.ok) {
                    if (response.status === 401) {
                        // Limpiar token expirado
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
                    }
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Data recibida:', data);
                // Asegurar que data sea un array
                const datosArray = Array.isArray(data) ? data : (data?.datos || data?.temperaturas || []);
                setDatos(datosArray);
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

    // Función para refrescar los datos
    const refreshData = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error('No hay token de autenticación. Por favor, inicia sesión.');
            }

            console.log('Refrescando datos...');

            const response = await fetch('https://telemetria-backend.onrender.com/api/temperaturas', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
                }
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const datosArray = Array.isArray(data) ? data : (data?.datos || data?.temperaturas || []);
            setDatos(datosArray);
        } catch (err) {
            setError(err.message);
            console.error('Error refreshing temperature data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Prepara los datos para la gráfica (sin modificar la hora)
    const datosGrafica = datos
        .slice()
        .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))
        .slice(0, 50) // Mostrar solo los últimos 50 registros
        .map(d => ({
            ...d,
            hora: new Date(d.fecha_hora).toLocaleTimeString("es-CL", {
                hour: '2-digit',
                minute: '2-digit'
            })
        }));

    if (loading) {
        return <MainLoading message="Cargando datos de telemetría..." />;
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
                        onClick={refreshData}
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
                    <div className="flex justify-center items-center mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                            <CpuChipIcon className="w-8 h-8 text-white" />
                        </div>
                        <button
                            onClick={refreshData}
                            disabled={loading}
                            className="ml-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Actualizar datos"
                        >
                            <svg
                                className={`w-5 h-5 text-blue-600 ${loading ? 'animate-spin' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
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
                    <motion.div
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                                <FireIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Temperatura Actual</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {datos.length > 0 ? `${datos[0]?.temperatura || 'N/A'}°C` : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                                <ChartPieIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Almacenamiento</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {datos.length > 0 ? `${datos[0]?.almacenamiento || 'N/A'}%` : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                                <CheckCircleIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Estado</p>
                                <p className="text-2xl font-bold text-gray-800">Activo</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                                <ClockIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Última Actualización</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {datos.length > 0 ? new Date(datos[0]?.fecha_hora).toLocaleTimeString("es-CL", {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Gráfico */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <ChartPieIcon className="w-6 h-6 text-blue-600 mr-2" />
                        Gráfico de Temperatura (Últimas 50 lecturas)
                    </h3>
                    {datosGrafica.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={datosGrafica}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="hora"
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft' }}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    labelFormatter={(value, payload) => {
                                        if (payload && payload[0]) {
                                            return `Hora: ${value}`;
                                        }
                                        return value;
                                    }}
                                    formatter={(value, name) => [
                                        `${value}°C`,
                                        name === 'temperatura' ? 'Temperatura' : name
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="temperatura"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-96 flex items-center justify-center">
                            <div className="text-center">
                                <ChartPieIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No hay datos para mostrar</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabla de Datos */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <ClockIcon className="w-6 h-6 text-blue-600 mr-2" />
                            Historial de Datos
                        </h3>
                    </div>

                    {datosPagina.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha y Hora
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Temperatura
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Almacenamiento
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {datosPagina.map((dato, idx) => (
                                            <motion.tr
                                                key={idx}
                                                className="hover:bg-gray-50 transition-colors duration-200"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(dato.fecha_hora).toLocaleString("es-CL")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        {dato.temperatura}°C
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {dato.almacenamiento}%
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {totalPaginas > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Mostrando {((pagina - 1) * porPagina) + 1} a {Math.min(pagina * porPagina, datos.length)} de {datos.length} registros
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setPagina(Math.max(1, pagina - 1))}
                                                disabled={pagina === 1}
                                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                <ChevronLeftIcon className="w-4 h-4" />
                                            </button>

                                            <span className="px-3 py-2 text-sm font-medium text-gray-700">
                                                Página {pagina} de {totalPaginas}
                                            </span>

                                            <button
                                                onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
                                                disabled={pagina === totalPaginas}
                                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                <ChevronRightIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <ChartPieIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                No hay datos disponibles
                            </h3>
                            <p className="text-gray-600">
                                Los datos de telemetría aparecerán aquí cuando estén disponibles.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TempData;