import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Lista = () => {
    const [proyectos, setProyectos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        codigo: "",
        nombre: "",
        estado: ""
    });

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/proyectos')
            .then(res => res.json())
            .then(setProyectos);
    }, []);

    const handleCrearProyecto = () => {
        setShowModal(true);
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await fetch('https://telemetria-backend.onrender.com/api/proyectos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            const nuevoProyecto = await res.json();
            setProyectos([nuevoProyecto, ...proyectos]);
            setShowModal(false);
            setForm({ codigo: "", nombre: "", estado: "" });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ codigo: "", nombre: "", estado: "" });
    };

    return (
        <div className="flex flex-col items-center mt-8 w-full">
            <div className="w-full max-w-3xl flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Lista de Proyectos</h2>
                <button
                    className="bg-blue-700 text-white px-4 py-2 rounded shadow"
                    onClick={handleCrearProyecto}
                >
                    Crear Proyecto
                </button>
            </div>

            {/* Modal para crear proyecto */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Crear Proyecto</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                className="border p-2 rounded"
                                name="codigo"
                                placeholder="Código"
                                value={form.codigo}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className="border p-2 rounded"
                                name="nombre"
                                placeholder="Nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className="border p-2 rounded"
                                name="estado"
                                placeholder="Estado"
                                value={form.estado}
                                onChange={handleChange}
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                    onClick={handleCloseModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table className="min-w-[300px] w-full max-w-3xl border border-gray-300 rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Código</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Nombre</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {proyectos.map((proyecto, idx) => (
                        <tr key={proyecto._id || idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{proyecto.codigo}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                <Link
                                    to={`/proyectos/${proyecto._id}`}
                                    className="text-blue-700 hover:underline font-semibold"
                                >
                                    {proyecto.nombre}
                                </Link>
                            </td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{proyecto.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Lista;