import React from 'react';
import { Link } from 'react-router-dom';
import {
    ChartPieIcon,
    CpuChipIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ArrowRightIcon,
    SparklesIcon,
    ShieldCheckIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export const Intro = () => {
    const features = [
        {
            icon: <ChartPieIcon className="w-8 h-8" />,
            title: "Telemetría Avanzada",
            description: "Monitoreo en tiempo real de sensores y dispositivos IoT"
        },
        {
            icon: <CpuChipIcon className="w-8 h-8" />,
            title: "ESP32 Integration",
            description: "Gestión completa de dispositivos ESP32 y Raspberry Pi"
        },
        {
            icon: <DocumentTextIcon className="w-8 h-8" />,
            title: "Gestión de Proyectos",
            description: "Organización y seguimiento de proyectos de telemetría"
        },
        {
            icon: <UserGroupIcon className="w-8 h-8" />,
            title: "Colaboración",
            description: "Trabajo en equipo con roles y permisos personalizados"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        {/* Logo/Brand */}
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                <ChartPieIcon className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                ROB-Data
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-4">
                            Sistema de Telemetría y Gestión de Información
                        </p>

                        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
                            Plataforma integral para el monitoreo, análisis y gestión de datos de telemetría.
                            Conecta, visualiza y controla tus dispositivos IoT de manera eficiente y profesional.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                            <Link
                                to="/login"
                                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                Iniciar Sesión
                                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/register"
                                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
                            >
                                <UserGroupIcon className="w-5 h-5 mr-2" />
                                Registrarse
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                                <div className="text-gray-400">Monitoreo Continuo</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">100%</div>
                                <div className="text-gray-400">Datos Seguros</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">IoT</div>
                                <div className="text-gray-400">Dispositivos Conectados</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white/5 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Características Principales
                        </h2>
                        <p className="text-xl text-gray-400">
                            Todo lo que necesitas para una gestión eficiente de telemetría
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Trust Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center justify-center space-x-3">
                            <ShieldCheckIcon className="w-8 h-8 text-green-400" />
                            <span className="text-white font-semibold">Datos Seguros</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                            <ClockIcon className="w-8 h-8 text-blue-400" />
                            <span className="text-white font-semibold">Tiempo Real</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                            <SparklesIcon className="w-8 h-8 text-purple-400" />
                            <span className="text-white font-semibold">Fácil de Usar</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} ROB-Data. Sistema de Telemetría Profesional.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Intro;