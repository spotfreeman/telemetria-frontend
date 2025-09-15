import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const porcentaje = 65; // Ejemplo: 65%

const TablaAvances = ({
    avance,
    nuevoAvance,
    mostrarEvolucion,
    handleAvanceChange,
    handleAgregarAvance,
    setMostrarEvolucion,
    handleBorrarAvance
}) => {
    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? null : section);
    };

    const accordionSections = [
        {
            id: 'progress',
            title: 'Progreso General',
            icon: '📊',
            content: (
                <div className="space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                            className="bg-blue-600 h-6 rounded-full transition-all duration-500 flex items-center justify-center text-white font-bold"
                            style={{ width: `${porcentaje}%` }}
                        >
                            {porcentaje}%
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">Progreso general del proyecto basado en los avances registrados.</p>
                </div>
            )
        },
        {
            id: 'add',
            title: 'Agregar Avance',
            icon: '➕',
            content: (
                <div className="space-y-4">
                    <form onSubmit={handleAgregarAvance} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                name="mes"
                                type="number"
                                min="1"
                                max="12"
                                placeholder="1-12"
                                value={nuevoAvance.mes}
                                onChange={handleAvanceChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                name="anio"
                                type="number"
                                min="2000"
                                max="2100"
                                placeholder="2024"
                                value={nuevoAvance.anio}
                                onChange={handleAvanceChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avance (%)</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                name="valor"
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                placeholder="0-100"
                                value={nuevoAvance.valor}
                                onChange={handleAvanceChange}
                                required
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                type="submit"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Agregar
                            </button>
                        </div>
                    </form>
                </div>
            )
        },
        {
            id: 'list',
            title: `Lista de Avances ${avance && avance.length > 0 ? `(${avance.length})` : ''}`,
            icon: '📋',
            content: avance && avance.length > 0 ? (
                <div className="space-y-4">
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mes</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Año</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Avance (%)</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {avance.map((a, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">{a.mes}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{a.anio}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {a.valor}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                onClick={() => handleBorrarAvance(idx)}
                                                title="Eliminar avance"
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Eliminar
                                            </button>
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
                    <p>No hay avances registrados aún.</p>
                    <p className="text-sm">Usa la sección "Agregar Avance" para comenzar.</p>
                </div>
            )
        },
        {
            id: 'chart',
            title: 'Gráfico de Evolución',
            icon: '📈',
            content: avance && avance.length > 0 ? (
                <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={avance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p>No hay datos suficientes para mostrar el gráfico.</p>
                    <p className="text-sm">Agrega algunos avances para ver la evolución.</p>
                </div>
            )
        }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Avances Físicos
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
        </div>
    );
};

export default TablaAvances;