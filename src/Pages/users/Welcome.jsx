import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    ChartPieIcon,
    FolderIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export const Bienvenida = () => {
    const [totalProyectos, setTotalProyectos] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Si no hay token, no hace la petición
            setTotalProyectos(0);
            navigate('/login'); // Redirige al login si no hay token
            return;
        }
        fetch('https://telemetria-backend.onrender.com/api/proyectos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    throw new Error('No autorizado');
                }
                if (!res.ok) throw new Error('Error en la petición');
                return res.json();
            })

            .then(data => setTotalProyectos(Array.isArray(data) ? data.length : 0))
            .catch(() => setTotalProyectos(0));
    }, []);

    const stats = [
        {
            id: 1,
            name: 'Proyectos Activos',
            value: `${totalProyectos}`,
            icon: <FolderIcon className="w-6 h-6" />,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            id: 2,
            name: 'Gasto Proyectado',
            value: '$500M',
            icon: <CurrencyDollarIcon className="w-6 h-6" />,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50",
            textColor: "text-green-600"
        },
        {
            id: 3,
            name: 'Progreso Ejecutado',
            value: '35%',
            icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600"
        },
        {
            id: 4,
            name: 'Usuarios Activos',
            value: '12',
            icon: <UserGroupIcon className="w-6 h-6" />,
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600"
        },
    ];

    // Funciones para redirigir según el rol
    const rol = localStorage.getItem("rol");
    const nombre = localStorage.getItem("nombre");

    const getRolDisplay = (rol) => {
        const rolesMap = {
            'admin': 'Administrador',
            'supervisor': 'Supervisor',
            'monitor': 'Monitor',
            'visor': 'Visor',
            'usuario': 'Usuario'
        };
        return rolesMap[rol] || 'Usuario';
    };

    const getRolColor = (rol) => {
        const colorsMap = {
            'admin': 'from-red-500 to-pink-500',
            'supervisor': 'from-purple-500 to-indigo-500',
            'monitor': 'from-blue-500 to-cyan-500',
            'visor': 'from-green-500 to-emerald-500',
            'usuario': 'from-gray-500 to-slate-500'
        };
        return colorsMap[rol] || 'from-gray-500 to-slate-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Header con saludo personalizado */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                <ChartPieIcon className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                            ¡Bienvenido, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{nombre || 'Usuario'}!</span>
                        </h1>

                        <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-6">
                            <div className={`w-3 h-3 bg-gradient-to-r ${getRolColor(rol)} rounded-full mr-2`}></div>
                            <span className="text-sm font-medium text-gray-700">
                                {getRolDisplay(rol)}
                            </span>
                        </div>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Plataforma integral para la gestión de telemetría de equipos.
                            Monitorea y analiza datos en tiempo real para optimizar el rendimiento y la seguridad.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat) => (
                            <div
                                key={stat.id}
                                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                        <div className={`text-white`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className={`w-3 h-3 bg-gradient-to-r ${stat.color} rounded-full`}></div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </h3>
                                <p className={`text-sm font-medium ${stat.textColor}`}>
                                    {stat.name}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Acciones Rápidas
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={() => navigate('/proyectos')}
                                className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                                    <FolderIcon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900">Proyectos</h3>
                                    <p className="text-sm text-gray-600">Gestionar proyectos</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/tempdata')}
                                className="group flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                                    <ChartPieIcon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900">Telemetría</h3>
                                    <p className="text-sm text-gray-600">Ver datos en tiempo real</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/usuarioconfig')}
                                className="group flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                                    <UserGroupIcon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900">Perfil</h3>
                                    <p className="text-sm text-gray-600">Configurar cuenta</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <div className="flex items-center px-4 py-2 bg-green-50 rounded-full border border-green-200">
                            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-800">Sistema Operativo</span>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                            <ClockIcon className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-blue-800">Tiempo Real</span>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
                            <ExclamationTriangleIcon className="w-5 h-5 text-purple-600 mr-2" />
                            <span className="text-sm font-medium text-purple-800">Monitoreo Activo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bienvenida;