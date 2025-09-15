import React from "react";
import { HiOutlineAdjustments } from "react-icons/hi";

const DatosGenerales = ({
    proyecto,
    mensaje,
    editando,
    form,
    handleChange,
    handleGuardar,
    setEditando,
    setForm
}) => (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.343A7.962 7.962 0 0112 5c-2.34 0-4.29 1.009-5.824 2.57" />
                </svg>
                Datos Generales
            </h3>
            {!editando && (
                <button
                    className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    onClick={() => setEditando(true)}
                >
                    <HiOutlineAdjustments className="w-4 h-4 mr-1" />
                    Editar
                </button>
            )}
        </div>
        {mensaje && <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 font-medium">{mensaje}</div>}
        {editando ? (
            <form onSubmit={handleGuardar} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código del Proyecto</label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            name="codigo"
                            value={form.codigo}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            name="estado"
                            value={form.estado}
                            onChange={handleChange}
                        >
                            <option value="planificacion">Planificación</option>
                            <option value="en_progreso">En Progreso</option>
                            <option value="en_revision">En Revisión</option>
                            <option value="pausado">Pausado</option>
                            <option value="completado">Completado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Proyecto</label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        rows={3}
                    />
                </div>
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar Cambios
                    </button>
                    <button
                        type="button"
                        className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        onClick={() => { setEditando(false); setForm(proyecto); }}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelar
                    </button>
                </div>
            </form>
        ) : (
            <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Código del Proyecto</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200 font-mono">{proyecto.codigo}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${proyecto.estado === 'completado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        proyecto.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            proyecto.estado === 'planificacion' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                proyecto.estado === 'en_revision' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                    proyecto.estado === 'pausado' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                        proyecto.estado === 'cancelado' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                        {proyecto.estado}
                    </span>
                </div>
                {proyecto.descripcion && (
                    <div className="py-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">Descripción</span>
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{proyecto.descripcion}</p>
                    </div>
                )}
            </div>
        )}
    </div>
);

export default DatosGenerales;