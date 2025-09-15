import React, { useState } from "react";

const FechasImportantes = ({
    fechas,
    formatFecha,
    handleEditarFechas,
    handleBorrarFechas,
    showFechasModal,
    setShowFechasModal,
    editFechasIdx,
    fechasForm,
    handleFechasChange,
    handleGuardarFechas,
    handleAgregarFechas,
    setFechasForm,
    setEditFechasIdx
}) => {
    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? null : section);
    };

    // Ordenar fechas por fecha de inicio (más reciente primero)
    const fechasOrdenadas = fechas ? [...fechas].sort((a, b) => {
        const fechaA = new Date(a.fechainicio);
        const fechaB = new Date(b.fechainicio);
        return fechaB - fechaA; // Más reciente primero
    }) : [];

    const accordionSections = [
        {
            id: 'add',
            title: 'Agregar Fechas Importantes',
            icon: '➕',
            content: (
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className="text-lg">📅</span>
                                <span className="text-sm text-gray-600">
                                    Agregar nuevas fechas importantes al proyecto
                                </span>
                            </div>
                            <button
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                onClick={() => { setFechasForm({ fechainicio: "", fechafin: "", aumento: 0 }); setEditFechasIdx(null); setShowFechasModal(true); }}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Agregar Fechas
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            Define fechas importantes del proyecto como hitos, entregas o fechas límite.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'latest',
            title: `Próxima Fecha Importante ${fechasOrdenadas.length > 0 ? `(${formatFecha(fechasOrdenadas[0].fechainicio)})` : ''}`,
            icon: '⏰',
            content: fechasOrdenadas.length > 0 ? (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {formatFecha(fechasOrdenadas[0].fechainicio)} - {formatFecha(fechasOrdenadas[0].fechafin)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Próxima fecha importante
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                                    onClick={() => handleEditarFechas(0)}
                                    title="Editar"
                                >
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Editar
                                </button>
                                <button
                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    onClick={() => handleBorrarFechas(0)}
                                    title="Eliminar"
                                >
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Aumento:</span>
                                <span className="ml-2 text-gray-900">{fechasOrdenadas[0].aumento} días</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Fecha Actualizada:</span>
                                <span className="ml-2 text-gray-900">{formatFecha(fechasOrdenadas[0].fechaactualizada)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No hay fechas importantes registradas.</p>
                    <p className="text-sm">Usa la sección "Agregar Fechas Importantes" para comenzar.</p>
                </div>
            )
        },
        {
            id: 'all',
            title: `Todas las Fechas ${fechas && fechas.length > 0 ? `(${fechas.length})` : ''}`,
            icon: '📋',
            content: fechas && fechas.length > 0 ? (
                <div className="space-y-4">
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Período</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aumento</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actualizada</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {fechasOrdenadas.map((fecha, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{formatFecha(fecha.fechainicio)}</span>
                                                <span className="text-xs text-gray-500">hasta {formatFecha(fecha.fechafin)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                +{fecha.aumento} días
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {formatFecha(fecha.fechaactualizada)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                                                    onClick={() => handleEditarFechas(idx)}
                                                    title="Editar"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Editar
                                                </button>
                                                <button
                                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                    onClick={() => handleBorrarFechas(idx)}
                                                    title="Eliminar"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>No hay fechas importantes registradas.</p>
                    <p className="text-sm">Los registros aparecerán aquí cuando se agreguen.</p>
                </div>
            )
        }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Fechas Importantes
                </h3>
            </div>

            <div className="space-y-2">
                {accordionSections.map((section) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors"
                            onClick={() => toggleAccordion(section.id)}
                        >
                            <div className="flex items-center">
                                <span className="text-lg mr-3">{section.icon}</span>
                                <span className="font-medium text-gray-900">{section.title}</span>
                            </div>
                            <svg
                                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${activeAccordion === section.id ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {activeAccordion === section.id && (
                            <div className="px-4 py-4 bg-white border-t border-gray-200">
                                {section.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showFechasModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {editFechasIdx !== null ? "Editar Fechas Importantes" : "Agregar Fechas Importantes"}
                            </h2>
                            <button
                                onClick={() => setShowFechasModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form
                            onSubmit={editFechasIdx !== null ? handleGuardarFechas : handleAgregarFechas}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                                    <input
                                        type="date"
                                        name="fechainicio"
                                        value={fechasForm.fechainicio}
                                        onChange={handleFechasChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                                    <input
                                        type="date"
                                        name="fechafin"
                                        value={fechasForm.fechafin}
                                        onChange={handleFechasChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Aumento (días)</label>
                                <input
                                    type="number"
                                    name="aumento"
                                    min="0"
                                    value={fechasForm.aumento}
                                    onChange={handleFechasChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                    onClick={() => setShowFechasModal(false)}
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

export default FechasImportantes;