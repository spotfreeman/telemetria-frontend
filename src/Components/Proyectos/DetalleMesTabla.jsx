import React, { useState } from "react";
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

const DetalleMesTabla = ({
    detalles,
    onEditar,
    onBorrar,
    editandoDetalleIdx,
    detalleEdit,
    setDetalleEdit,
    setEditandoDetalleIdx,
    handleGuardarDetalleMes
}) => {
    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? null : section);
    };

    // Ordenar detalles por fecha (más reciente primero)
    const detallesOrdenados = detalles ? [...detalles].sort((a, b) => {
        const fechaA = new Date(`${a.anio}-${String(a.mes).padStart(2, '0')}-01`);
        const fechaB = new Date(`${b.anio}-${String(b.mes).padStart(2, '0')}-01`);
        return fechaB - fechaA; // Más reciente primero
    }) : [];

    const accordionSections = [
        {
            id: 'latest',
            title: `Último Registro ${detallesOrdenados.length > 0 ? `(${detallesOrdenados[0].mes}/${detallesOrdenados[0].anio})` : ''}`,
            icon: '📅',
            content: detallesOrdenados.length > 0 ? (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {detallesOrdenados[0].mes}/{detallesOrdenados[0].anio}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Registro más reciente
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                                    onClick={() => onEditar(0)}
                                    title="Editar"
                                >
                                    <PencilSquareIcon className="h-3 w-3 mr-1" />
                                    Editar
                                </button>
                                <button
                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    onClick={() => onBorrar(0)}
                                    title="Eliminar"
                                >
                                    <TrashIcon className="h-3 w-3 mr-1" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-800 leading-relaxed">{detallesOrdenados[0].descripcion}</p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No hay registros de detalle del mes.</p>
                    <p className="text-sm">Los registros aparecerán aquí cuando se agreguen.</p>
                </div>
            )
        },
        {
            id: 'all',
            title: `Todos los Registros ${detalles && detalles.length > 0 ? `(${detalles.length})` : ''}`,
            icon: '📋',
            content: detalles && detalles.length > 0 ? (
                <div className="space-y-4">
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mes/Año</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descripción</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {detallesOrdenados.map((detalle, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {detalle.mes}/{detalle.anio}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white max-w-md">
                                            <p className="truncate" title={detalle.descripcion}>
                                                {detalle.descripcion}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                                                    onClick={() => onEditar(idx)}
                                                    title="Editar"
                                                >
                                                    <PencilSquareIcon className="h-3 w-3 mr-1" />
                                                    Editar
                                                </button>
                                                <button
                                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                    onClick={() => onBorrar(idx)}
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="h-3 w-3 mr-1" />
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
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>No hay registros de detalle del mes.</p>
                    <p className="text-sm">Los registros aparecerán aquí cuando se agreguen.</p>
                </div>
            )
        }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Detalle del Mes
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

            {/* Modal de edición */}
            {editandoDetalleIdx !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Editar Detalle del Mes</h4>
                            <button
                                onClick={() => setEditandoDetalleIdx(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleGuardarDetalleMes} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                                    <input
                                        type="number"
                                        name="mes"
                                        min="1"
                                        max="12"
                                        value={detalleEdit.mes}
                                        onChange={e => setDetalleEdit({ ...detalleEdit, mes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                                    <input
                                        type="number"
                                        name="anio"
                                        min="2000"
                                        max="2100"
                                        value={detalleEdit.anio}
                                        onChange={e => setDetalleEdit({ ...detalleEdit, anio: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    rows={4}
                                    value={detalleEdit.descripcion}
                                    onChange={e => setDetalleEdit({ ...detalleEdit, descripcion: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                    onClick={() => setEditandoDetalleIdx(null)}
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

export default DetalleMesTabla;