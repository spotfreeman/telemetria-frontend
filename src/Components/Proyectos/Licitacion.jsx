import React, { useState } from "react";

const Licitacion = ({
    licitacion,
    showLicitacionModal,
    handleAbrirLicitacionModal,
    idLicitacionInput,
    setIdLicitacionInput,
    handleGuardarLicitacion,
    setShowLicitacionModal
}) => {
    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? null : section);
    };

    const accordionSections = [
        {
            id: 'info',
            title: `Información de Licitación ${licitacion && licitacion.length > 0 ? `(${licitacion[0].idlicitacion})` : ''}`,
            icon: '📋',
            content: licitacion && licitacion.length > 0 ? (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    ID: {licitacion[0].idlicitacion}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Licitación registrada
                                </span>
                            </div>
                            <button
                                className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                                onClick={handleAbrirLicitacionModal}
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modificar
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            Esta licitación está asociada al proyecto y puede ser modificada cuando sea necesario.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.343A7.962 7.962 0 0112 5c-2.34 0-4.29 1.009-5.824 2.57" />
                    </svg>
                    <p>No hay información de licitación registrada.</p>
                    <p className="text-sm">Usa la sección "Agregar Licitación" para comenzar.</p>
                </div>
            )
        },
        {
            id: 'add',
            title: 'Agregar/Modificar Licitación',
            icon: '➕',
            content: (
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className="text-lg">📝</span>
                                <span className="text-sm text-gray-600">
                                    {licitacion && licitacion.length > 0 ? 'Modificar información de licitación' : 'Agregar nueva licitación al proyecto'}
                                </span>
                            </div>
                            <button
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                onClick={handleAbrirLicitacionModal}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                {licitacion && licitacion.length > 0 ? 'Modificar' : 'Agregar'} Licitación
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            {licitacion && licitacion.length > 0
                                ? 'Actualiza la información de la licitación asociada al proyecto.'
                                : 'Registra la información de la licitación relacionada con este proyecto.'
                            }
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'timeline',
            title: 'Cronograma de Licitación',
            icon: '📅',
            content: (
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <span className="text-lg">⏰</span>
                            <span className="text-sm text-gray-600">
                                Cronograma de fechas importantes de la licitación
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-300 rounded-lg">
                                <thead>
                                    <tr className="bg-yellow-50">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha Publicación</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Apertura Técnica</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Adjudicación Portal</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aprueba Contrato</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Por definir
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Por definir
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Por definir
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Por definir
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            Las fechas se actualizarán automáticamente cuando se registre la información de la licitación.
                        </p>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.343A7.962 7.962 0 0112 5c-2.34 0-4.29 1.009-5.824 2.57" />
                    </svg>
                    Módulo de Licitación
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

            {/* Modal de Licitación */}
            {showLicitacionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {licitacion && licitacion.length > 0 ? "Modificar Licitación" : "Agregar Licitación"}
                            </h2>
                            <button
                                onClick={() => setShowLicitacionModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleGuardarLicitacion} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID de Licitación</label>
                                <input
                                    type="text"
                                    value={idLicitacionInput}
                                    onChange={e => setIdLicitacionInput(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ingresa el ID de la licitación"
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Identificador único de la licitación en el sistema.
                                </p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                    onClick={() => setShowLicitacionModal(false)}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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

export default Licitacion;