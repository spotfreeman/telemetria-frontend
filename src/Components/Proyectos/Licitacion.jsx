import React from "react";

const Licitacion = ({
    licitacion,
    showLicitacionModal,
    handleAbrirLicitacionModal,
    idLicitacionInput,
    setIdLicitacionInput,
    handleGuardarLicitacion,
    setShowLicitacionModal
}) => (
    <>
        {/* Bloque principal de licitación */}
        <div className="w-full bg-blue-200 flex items-center justify-between px-4 py-2 rounded-t text-center">
            <h3 className="text-lg font-bold mb-2">Modulo de Licitacion : </h3>
            <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={handleAbrirLicitacionModal}
            >
                {licitacion && licitacion.length > 0 ? "Modificar" : "Agregar"} Licitación
            </button>
        </div>
        <div className="mb-4">
            <strong>ID Licitación:</strong>{" "}
            {licitacion && licitacion.length > 0
                ? licitacion[0].idlicitacion
                : <span className="text-gray-500">No registrada</span>}
        </div>
        <div>
            <table className="w-full border border-gray-300 rounded mb-8">
                <thead>
                    <tr className="bg-blue-100">
                        <th className="px-4 py-2">Fecha Publicacion</th>
                        <th className="px-4 py-2">Fecha Apertura Tecnica</th>
                        <th className="px-4 py-2">Fecha Adjudicacion Portal</th>
                        <th className="px-4 py-2">Aprueba Contrato</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-4 py-2">Dato fila 1, col 1</td>
                        <td className="border px-4 py-2">Dato fila 1, col 2</td>
                        <td className="border px-4 py-2">Dato fila 1, col 3</td>
                        <td className="border px-4 py-2">Dato fila 1, col 4</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2">Dato fila 2, col 1</td>
                        <td className="border px-4 py-2">Dato fila 2, col 2</td>
                        <td className="border px-4 py-2">Dato fila 2, col 3</td>
                        <td className="border px-4 py-2">Dato fila 2, col 4</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* Modal de Licitación */}
        {showLicitacionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-4">
                        {licitacion && licitacion.length > 0 ? "Modificar" : "Agregar"} Licitación
                    </h2>
                    <form onSubmit={handleGuardarLicitacion} className="flex flex-col gap-4">
                        <div>
                            <label className="block mb-1">ID Licitación</label>
                            <input
                                type="text"
                                value={idLicitacionInput}
                                onChange={e => setIdLicitacionInput(e.target.value)}
                                className="w-full border px-2 py-1 rounded"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-3 py-1 rounded"
                                onClick={() => setShowLicitacionModal(false)}
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
    </>
);

export default Licitacion;