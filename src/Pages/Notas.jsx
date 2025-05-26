import React, { useEffect, useState } from "react";

export const Notas = () => {
    const [notas, setNotas] = useState([]);
    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        usuario: ""
    });
    const [showModal, setShowModal] = useState(false);

    // Obtener notas al cargar el componente
    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/notas')
            .then(res => res.json())
            .then(setNotas);
    }, []);

    // Manejar cambios en el formulario
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Enviar nueva nota
    const handleSubmit = async e => {
        e.preventDefault();
        const res = await fetch('https://telemetria-backend.onrender.com/api/notas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            const nuevaNota = await res.json();
            setNotas([nuevaNota, ...notas]);
            setForm({ titulo: "", descripcion: "", usuario: "" });
            setShowModal(true);
            setTimeout(() => setShowModal(false), 2000); // Oculta el modal después de 2 segundos
        }
    };

    // Eliminar nota
    const handleDelete = async (id) => {
        const res = await fetch(`https://telemetria-backend.onrender.com/api/notas/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            setNotas(notas.filter(nota => nota._id !== id));
        }
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
                    Agregar Nota
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
                                    className="bg-red-600 text-white px-2 py-1 rounded"
                                    onClick={() => handleDelete(nota._id)}
                                >
                                    Eliminar
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