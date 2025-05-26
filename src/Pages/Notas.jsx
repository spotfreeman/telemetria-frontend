import React, { useEffect, useState } from "react";

export const Notas = () => {
    const [notas, setNotas] = useState([]);
    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        usuario: ""
    });
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/notas')
            .then(res => res.json())
            .then(setNotas);
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Enviar nueva nota o editar
    const handleSubmit = async e => {
        e.preventDefault();
        if (editId) {
            // Editar nota existente
            const res = await fetch(`https://telemetria-backend.onrender.com/api/notas/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form })
            });
            if (res.ok) {
                const notaActualizada = await res.json();
                setNotas(notas.map(n => n._id === editId ? notaActualizada : n));
                setEditId(null);
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000);
            }
        } else {
            // Crear nueva nota
            const nuevaNota = {
                ...form,
                fecha_hora: new Date().toISOString()
            };
            const res = await fetch('https://telemetria-backend.onrender.com/api/notas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaNota)
            });
            if (res.ok) {
                const notaGuardada = await res.json();
                setNotas([notaGuardada, ...notas]);
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000);
            }
        }
        setForm({ titulo: "", descripcion: "", usuario: "" });
    };

    const handleDelete = async (id) => {
        const res = await fetch(`https://telemetria-backend.onrender.com/api/notas/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            setNotas(notas.filter(nota => nota._id !== id));
        }
    };

    const handleEdit = (nota) => {
        setForm({
            titulo: nota.titulo,
            descripcion: nota.descripcion,
            usuario: nota.usuario
        });
        setEditId(nota._id);
    };

    return (
        <div className="flex flex-col items-center mt-8">
            {showModal && (
                <div className="fixed top-8 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg">
                    ¡Nota agregada exitosamente!
                </div>
            )}
            <h2 className="text-2xl font-bold mb-4">Notas</h2>
            <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 w-full max-w-md">
                <input
                    className="border p-2 rounded"
                    name="titulo"
                    placeholder="Título"
                    value={form.titulo}
                    onChange={handleChange}
                    required
                />
                <textarea
                    className="border p-2 rounded"
                    name="descripcion"
                    placeholder="Descripción"
                    value={form.descripcion}
                    onChange={handleChange}
                    required
                />
                <input
                    className="border p-2 rounded"
                    name="usuario"
                    placeholder="Usuario"
                    value={form.usuario}
                    onChange={handleChange}
                    required
                />
                <button className="bg-blue-700 text-white px-4 py-2 rounded" type="submit">
                    {editId ? "Actualizar Nota" : "Agregar Nota"}
                </button>
            </form>
            <table className="min-w-[300px] w-full max-w-2xl border border-gray-300 rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Fecha</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Título</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Descripción</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Usuario</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {notas.map((nota, idx) => (
                        <tr key={nota._id || idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                {new Date(nota.fecha_hora).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{nota.titulo}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{nota.descripcion}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{nota.usuario}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                <button
                                    className="bg-red-600 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => handleDelete(nota._id)}
                                >
                                    Eliminar
                                </button>
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                    onClick={() => handleEdit(nota)}
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Notas;