import React from "react";

const TablaAvances = ({
    avance,
    nuevoAvance,
    mostrarEvolucion,
    handleAvanceChange,
    handleAgregarAvance,
    setMostrarEvolucion,
    handleBorrarAvance
}) => (
    <div className="mt-10">
        <h3 className="text-lg font-bold mb-2">Tabla de Avances Fisicos</h3>
        <table className="w-full border border-gray-300 rounded mb-8">
            <thead>
                <tr className="bg-blue-100">
                    <th className="px-4 py-2">Ingresar avance</th>
                    <th className="px-4 py-2">Detalle de avance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="px-4 py-2 text-center">
                        <div className="mt-10 mb-6">
                            <h3 className="text-lg font-bold mb-2">Agregar avance mensual</h3>
                            <form onSubmit={handleAgregarAvance} className="flex flex-wrap gap-2 items-end">
                                <input className="border rounded px-2 py-1" name="mes" type="number" min="1" max="12" placeholder="Mes (1-12)" value={nuevoAvance.mes} onChange={handleAvanceChange} required />
                                <input className="border rounded px-2 py-1" name="anio" type="number" min="2000" max="2100" placeholder="Año" value={nuevoAvance.anio} onChange={handleAvanceChange} required />
                                <input className="border rounded px-2 py-1" name="valor" type="number" min="0" max="100" step="0.1" placeholder="Avance (%)" value={nuevoAvance.valor} onChange={handleAvanceChange} required />
                                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">Agregar</button>
                            </form>
                        </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                        {avance && avance.length > 0 && (
                            <div className="mt-6">
                                <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={() => setMostrarEvolucion(v => !v)}>
                                    {mostrarEvolucion ? "Ocultar evolución del avance" : "Mostrar evolución del avance"}
                                </button>
                                {mostrarEvolucion && (
                                    <>
                                        <h3 className="text-lg font-bold mb-2">Evolución del avance</h3>
                                        <table className="w-full border border-gray-300 rounded mb-8">
                                            <thead>
                                                <tr className="bg-blue-100">
                                                    <th className="px-4 py-2">Mes</th>
                                                    <th className="px-4 py-2">Año</th>
                                                    <th className="px-4 py-2">Avance (%)</th>
                                                    <th className="px-4 py-2">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {avance.map((a, idx) => (
                                                    <tr key={idx}>
                                                        <td className=" text-center">{a.mes}</td>
                                                        <td className=" text-center">{a.anio}</td>
                                                        <td className=" text-center">{a.valor}%</td>
                                                        <td className=" text-center">
                                                            <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded" onClick={() => handleBorrarAvance(idx)} title="Eliminar avance">
                                                                Eliminar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        )}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);

export default TablaAvances;