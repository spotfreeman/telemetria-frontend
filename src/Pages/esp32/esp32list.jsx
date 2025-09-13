import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MainLoading } from "../../Components/LoadingStates";
import {
    CpuChipIcon,
    ChartBarIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export const Esp32List = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDevices = async () => {
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

                // Usar la ruta unificada de telemetría
                const endpoint = 'https://telemetria-backend.onrender.com/api/telemetry/esp32';
                console.log('Usando endpoint:', endpoint);

                const response = await fetch(endpoint, {
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
                    throw new Error(`Error ${response.status}: ${response.statusText} en endpoint ${endpoint}`);
                }

                const data = await response.json();
                console.log('Data recibida:', data);
                console.log('Tipo de data:', typeof data);
                console.log('Es array?', Array.isArray(data));
                console.log('Tiene propiedad devices?', data?.devices);
                console.log('devices es array?', Array.isArray(data?.devices));

                // Asegurar que data sea un array
                const devicesArray = Array.isArray(data) ? data : (data?.devices || []);
                console.log('devicesArray final:', devicesArray);
                console.log('devicesArray length:', devicesArray.length);
                setDevices(devicesArray);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching ESP32 devices:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, []);

    if (loading) return <MainLoading message="Cargando dispositivos ESP32..." />;

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                    <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar dispositivos</h2>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4"
                    >
                        <CpuChipIcon className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Dispositivos ESP32
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Gestiona y monitorea tus dispositivos de telemetría
                    </p>
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
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                                <CpuChipIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Dispositivos</p>
                                <p className="text-2xl font-bold text-gray-800">{devices.length}</p>
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
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                                <CheckCircleIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Activos</p>
                                <p className="text-2xl font-bold text-gray-800">{devices.length}</p>
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
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                                <ChartBarIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Monitoreo</p>
                                <p className="text-2xl font-bold text-gray-800">24/7</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Lista de Dispositivos */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <CpuChipIcon className="w-6 h-6 text-blue-600 mr-2" />
                            Dispositivos Registrados
                        </h3>
                    </div>

                    {devices.length > 0 ? (
                        <div className="p-6">
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    Debug: {devices.length} dispositivos encontrados
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {devices.map((device, index) => (
                                    <motion.div
                                        key={device.deviceId || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group"
                                    >
                                        <Link
                                            to={`/esp32/${device.deviceId}`}
                                            className="block bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                                    <CpuChipIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex items-center text-green-600">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                    <span className="text-xs font-medium">Activo</span>
                                                </div>
                                            </div>

                                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                                {device.deviceId}
                                            </h4>

                                            <div className="flex items-center text-gray-600 text-sm">
                                                <ClockIcon className="w-4 h-4 mr-2" />
                                                <span>Última actualización: Reciente</span>
                                            </div>

                                            <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                                                <span>Ver detalles</span>
                                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CpuChipIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                No hay dispositivos registrados
                            </h3>
                            <p className="text-gray-600">
                                Los dispositivos ESP32 aparecerán aquí cuando se conecten al sistema.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Esp32List;