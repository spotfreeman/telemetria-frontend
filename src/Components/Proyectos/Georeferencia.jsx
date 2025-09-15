import React, { useState } from "react";
import { HiOutlineAdjustments } from "react-icons/hi";

const Georeferencia = ({
    georeferencia,
    geoForm,
    showGeoModal,
    setShowGeoModal,
    handleGeoChange,
    handleGuardarGeo
}) => {
    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? null : section);
    };

    const accordionSections = [
        {
            id: 'map',
            title: `Ubicación del Proyecto ${georeferencia && georeferencia.latitud && georeferencia.longitud ? `(${georeferencia.latitud}, ${georeferencia.longitud})` : ''}`,
            icon: '🗺️',
            content: georeferencia && georeferencia.latitud && georeferencia.longitud ? (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    Lat: {georeferencia.latitud}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    Lng: {georeferencia.longitud}
                                </span>
                            </div>
                            <button
                                className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                                onClick={() => setShowGeoModal(true)}
                            >
                                <HiOutlineAdjustments className="w-4 h-4 mr-1" />
                                Editar
                            </button>
                        </div>
                        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <iframe
                                title="mapa-georeferencia"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps?q=${georeferencia.latitud},${georeferencia.longitud}&output=embed`}
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                            Ubicación geográfica del proyecto en el mapa interactivo.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p>No hay georeferencia registrada.</p>
                    <p className="text-sm">Usa la sección "Configurar Ubicación" para agregar coordenadas.</p>
                </div>
            )
        },
        {
            id: 'config',
            title: 'Configurar Ubicación',
            icon: '⚙️',
            content: (
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className="text-lg">📍</span>
                                <span className="text-sm text-gray-600">
                                    {georeferencia && georeferencia.latitud && georeferencia.longitud
                                        ? 'Modificar coordenadas del proyecto'
                                        : 'Agregar coordenadas geográficas del proyecto'
                                    }
                                </span>
                            </div>
                            <button
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                onClick={() => setShowGeoModal(true)}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                {georeferencia && georeferencia.latitud && georeferencia.longitud ? 'Modificar' : 'Agregar'} Ubicación
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            {georeferencia && georeferencia.latitud && georeferencia.longitud
                                ? 'Actualiza las coordenadas geográficas del proyecto para mostrar la ubicación correcta en el mapa.'
                                : 'Registra las coordenadas geográficas del proyecto para visualizar su ubicación en el mapa.'
                            }
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'info',
            title: 'Información de Coordenadas',
            icon: 'ℹ️',
            content: (
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <span className="text-lg">📊</span>
                            <span className="text-sm text-gray-600">
                                Información sobre coordenadas geográficas
                            </span>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start space-x-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Latitud
                                </span>
                                <p className="text-gray-700">
                                    Coordenada que indica la posición norte-sur del proyecto. Rango: -90° a +90°.
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Longitud
                                </span>
                                <p className="text-gray-700">
                                    Coordenada que indica la posición este-oeste del proyecto. Rango: -180° a +180°.
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Formato
                                </span>
                                <p className="text-gray-700">
                                    Utiliza el formato decimal (ej: -33.4489, -70.6693 para Santiago, Chile).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Georeferencia
                </h3>
            </div>

            <div className="space-y-2">
                {accordionSections.map((section) => (
                    <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                            className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors"
                            onClick={() => toggleAccordion(section.id)}
                        >
                            <div className="flex items-center">
                                <span className="text-lg mr-3">{section.icon}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{section.title}</span>
                            </div>
                            <svg
                                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${activeAccordion === section.id ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {activeAccordion === section.id && (
                            <div className="px-4 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                                {section.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal de Georeferencia */}
            {showGeoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {georeferencia && georeferencia.latitud && georeferencia.longitud
                                    ? "Modificar Georeferencia"
                                    : "Agregar Georeferencia"
                                }
                            </h3>
                            <button
                                onClick={() => setShowGeoModal(false)}
                                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form
                            onSubmit={e => {
                                handleGuardarGeo(e);
                                setShowGeoModal(false);
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitud</label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    name="latitud"
                                    type="number"
                                    step="any"
                                    placeholder="Ej: -33.4489"
                                    value={geoForm.latitud}
                                    onChange={handleGeoChange}
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Coordenada norte-sur (-90° a +90°)
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitud</label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    name="longitud"
                                    type="number"
                                    step="any"
                                    placeholder="Ej: -70.6693"
                                    value={geoForm.longitud}
                                    onChange={handleGeoChange}
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Coordenada este-oeste (-180° a +180°)
                                </p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                    onClick={() => setShowGeoModal(false)}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancelar
                                </button>
                                <button
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
                                    type="submit"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Georeferencia;