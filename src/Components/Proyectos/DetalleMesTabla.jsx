import React from "react";
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
}) => (
    <div className="mt-10">
        <h3 className="text-lg font-bold mb-2">Detalle del Mes</h3>
        <table className="min-w-full border mt-2">
            <thead>
                <tr className="bg-blue-700 text-white">
                    <th className="px-4 py-2 border">Mes</th>
                    <th className="px-4 py-2 border">Año</th>
                    <th className="px-4 py-2 border">Descripción</th>
                    <th className="px-4 py-2 border">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {detalles?.map((detalle, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                        <td className="px-4 py-2 border">{detalle.mes}</td>
                        <td className="px-4 py-2 border">{detalle.anio}</td>
                        <td className="px-4 py-2 border">{detalle.descripcion}</td>
                        <td className="px-4 py-2 border text-center">
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded mr-2" onClick={() => onEditar(idx)} title="Editar">
                                <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white p-1 rounded" onClick={() => onBorrar(idx)} title="Borrar">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Modal de edición */}
        {editandoDetalleIdx !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                    <h4 className="text-lg font-bold mb-4">Editar Detalle del Mes</h4>
                    <form onSubmit={handleGuardarDetalleMes} className="flex flex-col gap-3">
                        <div>
                            <label className="block mb-1">Mes</label>
                            <input
                                type="text"
                                name="mes"
                                value={detalleEdit.mes}
                                onChange={e => setDetalleEdit({ ...detalleEdit, mes: e.target.value })}
                                className="w-full border px-2 py-1 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Año</label>
                            <input
                                type="text"
                                name="anio"
                                value={detalleEdit.anio}
                                onChange={e => setDetalleEdit({ ...detalleEdit, anio: e.target.value })}
                                className="w-full border px-2 py-1 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Descripción</label>
                            <textarea
                                name="descripcion"
                                value={detalleEdit.descripcion}
                                onChange={e => setDetalleEdit({ ...detalleEdit, descripcion: e.target.value })}
                                className="w-full border px-2 py-1 rounded"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-3 py-1 rounded"
                                onClick={() => setEditandoDetalleIdx(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
);

export default DetalleMesTabla;