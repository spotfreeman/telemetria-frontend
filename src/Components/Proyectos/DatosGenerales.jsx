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
    <div className="w-auto mx-auto mt-2 bg-white rounded shadow p-8">
        <div>
            <div className="w-full bg-blue-100 rounded">
                <h2 className="text-2xl font-bold mb-4 px-2 py-2 text-black">{proyecto.nombre}</h2>
            </div>
            {mensaje && <div className="mb-4 text-green-700 font-semibold">{mensaje}</div>}
            {editando ? (
                <form onSubmit={handleGuardar} className="flex flex-col gap-4 mb-8">
                    <label>
                        <span className="font-semibold">Código:</span>
                        <input className="border rounded px-2 py-1 w-full" name="codigo" value={form.codigo} onChange={handleChange} />
                    </label>
                    <label>
                        <span className="font-semibold">Nombre:</span>
                        <input className="border rounded px-2 py-1 w-full" name="nombre" value={form.nombre} onChange={handleChange} />
                    </label>
                    <label>
                        <span className="font-semibold">Estado:</span>
                        <input className="border rounded px-2 py-1 w-full" name="estado" value={form.estado} onChange={handleChange} />
                    </label>
                    <label>
                        <span className="font-semibold">Detalle:</span>
                        <textarea className="border rounded px-2 py-1 w-full" name="descripcion" value={form.descripcion} onChange={handleChange} />
                    </label>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
                        <button
                            type="button"
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => { setEditando(false); setForm(proyecto); }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <div className="relative">
                    <table className="mb-8 w-full border border-gray-300 rounded">
                        <tbody>
                            <tr>
                                <th className="bg-blue-100 px-4 py-2 text-left w-1/4">Nombre</th>
                                <td className="px-4 py-2">{proyecto.nombre}</td>
                            </tr>
                            <tr>
                                <th className="bg-blue-100 px-4 py-2 text-left">Código</th>
                                <td className="px-4 py-2">{proyecto.codigo}</td>
                            </tr>
                            <tr>
                                <th className="bg-blue-100 px-4 py-2 text-left">Estado</th>
                                <td className="px-4 py-2">{proyecto.estado}</td>
                            </tr>
                            <tr>
                                <th className="bg-blue-100 px-4 py-2 text-left">Descripcion</th>
                                <td className="px-4 py-2">{proyecto.descripcion}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button
                        className="absolute top-2 right-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => setEditando(true)}
                    >
                        <HiOutlineAdjustments />
                    </button>
                </div>
            )}
        </div>
    </div>
);

export default DatosGenerales;