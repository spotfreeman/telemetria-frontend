import React, { useEffect, useState } from "react";
import { 
    ServerIcon, 
    GlobeAltIcon, 
    PlayIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

import daysImg from "./Img/days.jpg"
import unityImg from "./Img/unitylogo.png";

export const Server = () => {
    const [datos, setDatos] = useState([]);
    const [datosServer, setDatosServer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const [rpisResponse, serverResponse] = await Promise.all([
                    fetch('https://telemetria-backend.onrender.com/api/rpis'),
                    fetch('https://telemetria-backend.onrender.com/api/serverip')
                ]);

                if (!rpisResponse.ok || !serverResponse.ok) {
                    throw new Error('Error al cargar los datos de servidores');
                }

                const [rpisData, serverData] = await Promise.all([
                    rpisResponse.json(),
                    serverResponse.json()
                ]);

                // Ordena los datos por fecha_hora descendente (más nuevo primero)
                const datosOrdenados = [...rpisData].sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
                const datosServerOrdenados = [...serverData].sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
                
                setDatos(datosOrdenados);
                setDatosServer(datosServerOrdenados);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching server data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const ultimaIpExterna = datos.length > 0 ? datos[0].ip_externa : "No disponible";

    const ultimaIpServidor = datosServer.length > 0 ? datosServer[0].ip_externa : "No disponible";

    const servidores = [
        {
            name: 'Servidor 7 Days',
            ip: ultimaIpExterna,
            image: daysImg,
            bio: 'Servidor dedicado para el juego 7 Days to Die, optimizado para ofrecer la mejor experiencia de juego.',
            url: '#',
        },
        {
            name: 'Servidor Unity',
            ip: ultimaIpServidor,
            image: unityImg,
            bio: 'Servidor dedicado para aplicaciones Unity, ideal para proyectos de desarrollo y pruebas.',
            url: ultimaIpServidor !== "No disponible" ? `http://${ultimaIpServidor}:3000` : "#",
        }
    ]

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <ServerIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Cargando servidores...</h2>
                    <p className="text-gray-500">Obteniendo información de los servidores disponibles</p>
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
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar servidores</h2>
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
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                        <ServerIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Servidores Disponibles
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-3xl mx-auto">
                        Servidores optimizados para juegos y aplicaciones, diseñados para ofrecer la mejor experiencia de usuario con rendimiento y estabilidad.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircleIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{servidores.length}</h3>
                        <p className="text-sm font-medium text-green-600">Servidores Activos</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <GlobeAltIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">24/7</h3>
                        <p className="text-sm font-medium text-blue-600">Disponibilidad</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <ClockIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">Ultra</h3>
                        <p className="text-sm font-medium text-purple-600">Baja Latencia</p>
                    </div>
                </div>

                {/* Lista de Servidores */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {servidores.map((servidor, index) => (
                        <div
                            key={servidor.name}
                            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            {/* Imagen del servidor */}
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    alt={servidor.name} 
                                    src={servidor.image} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute top-4 right-4">
                                    <div className="flex items-center px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full">
                                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                                        <span className="text-xs font-medium text-white">Online</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido del servidor */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{servidor.name}</h3>
                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <GlobeAltIcon className="w-4 h-4 mr-2" />
                                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                                {servidor.ip}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <PlayIcon className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {servidor.bio}
                                </p>

                                {/* Botón de acceso */}
                                <a
                                    href={servidor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/btn inline-flex items-center w-full justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    <span>Acceder al Servidor</span>
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-200" />
                                </a>

                                {/* Información adicional */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <CheckCircleIcon className="w-3 h-3 mr-1 text-green-500" />
                                            <span>Servidor Verificado</span>
                                        </div>
                                        <div className="flex items-center">
                                            <ClockIcon className="w-3 h-3 mr-1" />
                                            <span>Última actualización: Ahora</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer informativo */}
                <div className="mt-12 text-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 max-w-4xl mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Necesitas ayuda?</h3>
                        <p className="text-gray-600 mb-4">
                            Si tienes problemas para conectarte a alguno de los servidores, verifica tu conexión a internet y asegúrate de que el servidor esté en línea.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="flex items-center px-3 py-1 bg-green-50 rounded-full">
                                <CheckCircleIcon className="w-4 h-4 mr-1 text-green-600" />
                                <span className="text-green-800">Todos los servidores están operativos</span>
                            </div>
                            <div className="flex items-center px-3 py-1 bg-blue-50 rounded-full">
                                <ClockIcon className="w-4 h-4 mr-1 text-blue-600" />
                                <span className="text-blue-800">Monitoreo 24/7 activo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}