import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MainLoading } from "../Components/LoadingStates";
import { useTheme } from "../Contexts/ThemeContext";
import {
    ChartPieIcon,
    CpuChipIcon,
    FireIcon,
    CloudIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    UsersIcon,
    FolderIcon,
    CalendarDaysIcon,
    BoltIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

export const Dashboard = () => {
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalDevices: 0,
            activeDevices: 0,
            totalProjects: 0,
            activeProjects: 0,
            totalUsers: 0,
            systemUptime: 0
        },
        temperatureData: [],
        humidityData: [],
        projectStatus: [],
        recentActivity: []
    });

    const fetchDashboardData = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error('No hay token de autenticación');
                }

                // Fetch múltiples endpoints en paralelo
                const [esp32Response, tempResponse, projectsResponse] = await Promise.all([
                    fetch('https://telemetria-backend.onrender.com/api/telemetry/esp32', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('https://telemetria-backend.onrender.com/api/temperaturas', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('https://telemetria-backend.onrender.com/api/proyectos', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                const [esp32Data, tempData, projectsData] = await Promise.all([
                    esp32Response.json(),
                    tempResponse.json(),
                    projectsResponse.json()
                ]);

                // Procesar datos para el dashboard
                const processedData = {
                    stats: {
                        totalDevices: esp32Data?.dispositivos?.length || 0,
                        activeDevices: esp32Data?.dispositivos?.filter(d => d.status === 'online').length || 0,
                        totalProjects: Array.isArray(projectsData) ? projectsData.length : (projectsData?.proyectos?.length || 0),
                        activeProjects: Array.isArray(projectsData) ?
                            projectsData.filter(p => p.estado === 'en_progreso').length :
                            (projectsData?.proyectos?.filter(p => p.estado === 'en_progreso').length || 0),
                        totalUsers: 0, // TODO: Implementar endpoint de usuarios
                        systemUptime: 99.9 // TODO: Calcular uptime real
                    },
                    temperatureData: Array.isArray(tempData) ?
                        tempData.slice(0, 10).map(d => ({
                            hora: new Date(d.fecha_hora).toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' }),
                            temperatura: d.temperatura
                        })) : [],
                    humidityData: Array.isArray(tempData) ?
                        tempData.slice(0, 10).map(d => ({
                            hora: new Date(d.fecha_hora).toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' }),
                            humedad: d.almacenamiento || 0
                        })) : [],
                    projectStatus: Array.isArray(projectsData) ?
                        projectsData.reduce((acc, project) => {
                            const status = project.estado || 'desconocido';
                            acc[status] = (acc[status] || 0) + 1;
                            return acc;
                        }, {}) : {},
                    recentActivity: [
                        { id: 1, type: 'device', message: 'ESP32_001 envió datos', time: '2 min ago', status: 'success' },
                        { id: 2, type: 'project', message: 'Proyecto Alpha actualizado', time: '5 min ago', status: 'info' },
                        { id: 3, type: 'alert', message: 'Temperatura alta detectada', time: '10 min ago', status: 'warning' },
                        { id: 4, type: 'user', message: 'Nuevo usuario registrado', time: '15 min ago', status: 'success' }
                    ]
                };

                setDashboardData(processedData);
                setLastUpdate(new Date());
            } catch (err) {
                setError(err.message);
                console.error('Error fetching dashboard data:', err);
            } finally {
                if (isRefresh) {
                    setRefreshing(false);
                } else {
                    setLoading(false);
                }
            }
        };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return <MainLoading message="Cargando Dashboard..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar Dashboard</h2>
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

    const { stats, temperatureData, humidityData, projectStatus, recentActivity } = dashboardData;

    // Colores para gráficos
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800'
                : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
            }`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4"
                    >
                        <ChartPieIcon className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Dashboard de Telemetría
                    </h1>
                    <p className={`text-lg transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        Monitoreo en tiempo real del sistema
                    </p>
                    <div className="flex items-center justify-center mt-4 space-x-4">
                        <div className={`flex items-center space-x-6 text-sm transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            <div className="flex items-center">
                                <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
                                Sistema operativo
                            </div>
                            <div className="flex items-center">
                                <ClockIcon className="w-4 h-4 mr-1 text-blue-500" />
                                Última actualización: {lastUpdate.toLocaleTimeString("es-CL")}
                            </div>
                        </div>
                        <button
                            onClick={() => fetchDashboardData(true)}
                            disabled={refreshing}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                                refreshing
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : isDarkMode
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                            title="Actualizar datos"
                        >
                            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`backdrop-blur-sm rounded-2xl shadow-xl border p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${isDarkMode
                                ? 'bg-gray-800/80 border-gray-700/50'
                                : 'bg-white/80 border-white/20'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Dispositivos Activos</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.activeDevices}</p>
                                <p className="text-sm text-gray-400">de {stats.totalDevices} total</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <CpuChipIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600 font-medium">100% operativo</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`backdrop-blur-sm rounded-2xl shadow-xl border p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${isDarkMode
                                ? 'bg-gray-800/80 border-gray-700/50'
                                : 'bg-white/80 border-white/20'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Proyectos Activos</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.activeProjects}</p>
                                <p className="text-sm text-gray-400">de {stats.totalProjects} total</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <FolderIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <ArrowTrendingUpIcon className="w-4 h-4 text-blue-500 mr-1" />
                            <span className="text-sm text-blue-600 font-medium">En progreso</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`backdrop-blur-sm rounded-2xl shadow-xl border p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${isDarkMode
                                ? 'bg-gray-800/80 border-gray-700/50'
                                : 'bg-white/80 border-white/20'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Usuarios</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                                <p className="text-sm text-gray-400">Registrados</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                <UsersIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <ArrowTrendingUpIcon className="w-4 h-4 text-purple-500 mr-1" />
                            <span className="text-sm text-purple-600 font-medium">Creciendo</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`backdrop-blur-sm rounded-2xl shadow-xl border p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${isDarkMode
                                ? 'bg-gray-800/80 border-gray-700/50'
                                : 'bg-white/80 border-white/20'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Uptime</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.systemUptime}%</p>
                                <p className="text-sm text-gray-400">Disponibilidad</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                                <ClockIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600 font-medium">Estable</span>
                        </div>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Temperature Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
                    >
                        <div className="flex items-center mb-4">
                            <FireIcon className="w-6 h-6 text-red-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-800">Temperatura en Tiempo Real</h3>
                        </div>
                        {temperatureData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={temperatureData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hora" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="temperatura"
                                        stroke="#EF4444"
                                        strokeWidth={2}
                                        dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex items-center justify-center">
                                <p className="text-gray-500">No hay datos de temperatura disponibles</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Project Status Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
                    >
                        <div className="flex items-center mb-4">
                            <ChartPieIcon className="w-6 h-6 text-blue-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-800">Estado de Proyectos</h3>
                        </div>
                        {Object.keys(projectStatus).length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={Object.entries(projectStatus).map(([key, value]) => ({ name: key, value }))}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {Object.entries(projectStatus).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex items-center justify-center">
                                <p className="text-gray-500">No hay proyectos disponibles</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <ClockIcon className="w-6 h-6 text-blue-600 mr-2" />
                            Actividad Reciente
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className={`w-3 h-3 rounded-full mr-4 ${activity.status === 'success' ? 'bg-green-500' :
                                            activity.status === 'warning' ? 'bg-yellow-500' :
                                                activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                        }`}></div>
                                    <div className="flex-1">
                                        <p className="text-gray-800 font-medium">{activity.message}</p>
                                        <p className="text-sm text-gray-500">{activity.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
