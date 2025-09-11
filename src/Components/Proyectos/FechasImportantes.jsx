import React from "react";

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
}) => (
    <div className="w-full mt-10 text-center">
        <div className="w-full bg-blue-200 flex items-center justify-between px-4 py-2 rounded-t text-center">
            <h3 className="text-lg font-bold mb-2">Fechas importantes</h3>
            <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => { setFechasForm({ fechainicio: "", fechafin: "", aumento: 0 }); setEditFechasIdx(null); setShowFechasModal(true); }}
            >
                Agregar Fechas
            </button>
        </div>

        <table className="w-full table-fixed border border-gray-300 border-collapse rounded mb-8">
            <thead className="bg-blue-100">
                <tr>
                    <th className="w-1/5 border">Fecha Inicio</th>
                    <th className="w-1/5 border">Fecha Fin</th>
                    <th className="w-1/5 border">Aumento</th>
                    <th className="w-1/5 border">Fecha Actualizada</th>
                    <th className="w-1/5 border">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {fechas?.map((fecha, idx) => (
                    <tr key={idx}>
                        <td className="border">{formatFecha(fecha.fechainicio)}</td>
                        <td className="border">{formatFecha(fecha.fechafin)}</td>
                        <td className="border">{fecha.aumento}</td>
                        <td className="border">{formatFecha(fecha.fechaactualizada)}</td>
                        <td className="border">
                            <button
                                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                onClick={() => handleEditarFechas(idx)}
                            >
                                Editar
                            </button>
                            <button
                                className="bg-red-600 text-white px-2 py-1 rounded"
                                onClick={() => handleBorrarFechas(idx)}
                            >
                                Borrar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Modal */}
        {showFechasModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-4">
                        {editFechasIdx !== null ? "Editar Fechas" : "Agregar Fechas"}
                    </h2>
                    <form
                        onSubmit={editFechasIdx !== null ? handleGuardarFechas : handleAgregarFechas}
                        className="flex flex-col gap-4"
                    >
                        <div>
                            <label className="block mb-1">Fecha Inicio</label>
                            <input
                                type="date"
                                name="fechainicio"
                                value={fechasForm.fechainicio}
                                onChange={handleFechasChange}
                                className="w-full border px-2 py-1 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Fecha Fin</label>
                            <input
                                type="date"
                                name="fechafin"
                                value={fechasForm.fechafin}
                                onChange={handleFechasChange}
                                className="w-full border px-2 py-1 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Aumento (días)</label>
                            <input
                                type="number"
                                name="aumento"
                                value={fechasForm.aumento}
                                onChange={handleFechasChange}
                                className="w-full border px-2 py-1 rounded"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-3 py-1 rounded"
                                onClick={() => setShowFechasModal(false)}
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

export default FechasImportantes;