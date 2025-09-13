import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { MainLoading } from "../../Components/LoadingStates";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {
    CpuChipIcon,
    ChartBarIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    FireIcon,
    CloudIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export const Esp32Detail = () => {
    const { deviceId } = useParams();
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDay, setSelectedDay] = useState(""); // Día seleccionado

    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No hay token de autenticación. Por favor, inicia sesión.");
                    setLoading(false);
                    return;
                }

                console.log('Token encontrado:', token ? 'Sí' : 'No');
                console.log('Haciendo request a:', `https://telemetria-backend.onrender.com/api/telemetry/esp32/${deviceId}`);

                const response = await fetch(`https://telemetria-backend.onrender.com/api/telemetry/esp32/${deviceId}`, {
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
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
                    }
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Data recibida:', data);
                setDevice(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching ESP32 device data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeviceData();
    }, [deviceId]);

    if (loading) return <MainLoading message="Cargando datos del dispositivo..." />;

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                    <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar dispositivo</h2>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Link
                        to="/esp32"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Volver a la lista
                    </Link>
                </div>
            </div>
        );
    }

    if (!device || (Array.isArray(device) && device.length === 0)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                    <CpuChipIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Dispositivo no encontrado</h2>
                    <p className="text-gray-500 mb-4">No se encontró el dispositivo especificado.</p>
                    <Link
                        to="/esp32"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Volver a la lista
                    </Link>
                </div>
            </div>
        );
    }

    const deviceObj = Array.isArray(device) ? device[0] : device;
    const datas = Array.isArray(deviceObj?.datas) ? deviceObj.datas : [];

    // Agrupar datos por día
    const datosPorDia = {};
    datas.forEach(d => {
        const fecha = new Date(d.timestamp).toLocaleDateString("es-CL");
        if (!datosPorDia[fecha]) {
            datosPorDia[fecha] = [];
        }
        datosPorDia[fecha].push(d);
    });

    const diasDisponibles = Object.keys(datosPorDia);

    // Filtrar datos por día seleccionado
    const datosFiltrados = selectedDay ? datosPorDia[selectedDay] : datas;

    const labels = datosFiltrados.map(d => new Date(d.timestamp).toLocaleTimeString("es-CL"));
    const tempData = datosFiltrados.map(d => d.temperature);
    const humData = datosFiltrados.map(d => d.humidity);

    const tempChartData = {
        labels,
        datasets: [
            {
                label: "Temperatura (°C)",
                data: tempData,
                fill: false,
                borderColor: "rgb(37, 99, 235)",
                backgroundColor: "rgba(37, 99, 235, 0.2)",
                tension: 0.2,
                pointRadius: 2,
            },
        ],
    };

    const humChartData = {
        labels,
        datasets: [
            {
                label: "Humedad (%)",
                data: humData,
                fill: false,
                borderColor: "rgb(6, 182, 212)",
                backgroundColor: "rgba(6, 182, 212, 0.2)",
                tension: 0.2,
                pointRadius: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, position: "top" },
            title: { display: false },
        },
        scales: {
            x: { ticks: { maxTicksLimit: 8 } },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/esp32"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Volver a la lista
                    </Link>

                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4"
                        >
                            <CpuChipIcon className="w-10 h-10 text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            {deviceObj.deviceId}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Monitoreo en tiempo real de sensores
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                                <FireIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Temperatura Promedio</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {datas.length > 0 ? (datas.reduce((sum, d) => sum + d.temperature, 0) / datas.length).toFixed(1) : '0'}°C
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                                <CloudIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Humedad Promedio</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {datas.length > 0 ? (datas.reduce((sum, d) => sum + d.humidity, 0) / datas.length).toFixed(1) : '0'}%
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                                <ChartBarIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Lecturas</p>
                                <p className="text-2xl font-bold text-gray-800">{datas.length}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filtro de Fecha */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex items-center">
                            <CalendarDaysIcon className="w-6 h-6 text-blue-600 mr-2" />
                            <label className="font-semibold text-gray-700">Filtrar por día:</label>
                        </div>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={selectedDay}
                            onChange={e => setSelectedDay(e.target.value)}
                        >
                            <option value="">Todos los días</option>
                            {diasDisponibles.map(dia => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
                    >
                        <div className="flex items-center mb-4">
                            <FireIcon className="w-6 h-6 text-red-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-800">Temperatura</h3>
                        </div>
                        <Line data={tempChartData} options={chartOptions} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
                    >
                        <div className="flex items-center mb-4">
                            <CloudIcon className="w-6 h-6 text-blue-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-800">Humedad</h3>
                        </div>
                        <Line data={humChartData} options={chartOptions} />
                    </motion.div>
                </div>

                {/* Tabla de Datos */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <ClockIcon className="w-6 h-6 text-blue-600 mr-2" />
                            Historial de Lecturas
                        </h3>
                    </div>

                    {datosFiltrados.length > 0 ? (
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
                                            Humedad
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {datosFiltrados.map((d, idx) => (
                                        <motion.tr
                                            key={idx}
                                            className="hover:bg-gray-50 transition-colors duration-200"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(d.timestamp).toLocaleString("es-CL")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    {d.temperature}°C
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {d.humidity}%
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                No hay datos disponibles
                            </h3>
                            <p className="text-gray-600">
                                {selectedDay ? 'No hay lecturas para el día seleccionado.' : 'El dispositivo aún no ha enviado datos.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Esp32Detail;