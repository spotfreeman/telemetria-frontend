import React, { useEffect, useState } from "react";

export const Archivos = () => {
    const [archivos, setArchivos] = useState([]);
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        link: ""
    });
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [busqueda, setBusqueda] = useState(""); // Nuevo estado para búsqueda

    // Obtener token del localStorage
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchArchivos = async () => {
            try {
                const res = await fetch('https://telemetria-backend.onrender.com/api/archivos', {
                    headers: token ? { "Authorization": `Bearer ${token}` } : {}
                });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setArchivos(data);
                    } else if (Array.isArray(data.archivos)) {
                        setArchivos(data.archivos);
                    } else {
                        setArchivos([]);
                    }
                } else {
                    setArchivos([]);
                }
            } catch {
                setArchivos([]);
            }
        };
        fetchArchivos();
    }, [token]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        // Solo permitir si hay token
        if (!token) return;

        const res = await fetch(editId
            ? `https://telemetria-backend.onrender.com/api/archivos/${editId}`
            : 'https://telemetria-backend.onrender.com/api/archivos',
            {
                method: editId ? 'PUT' : 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            }
        );
        if (res.ok) {
            const archivoGuardado = await res.json();
            if (editId) {
                setArchivos(archivos.map(a => a._id === editId ? archivoGuardado : a));
                setEditId(null);
            } else {
                setArchivos([archivoGuardado, ...archivos]);
            }
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }
        setForm({ nombre: "", descripcion: "", link: "" });
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        if (!token) return;
        if (window.confirm("¿Estás seguro de que deseas eliminar este archivo?")) {
            const res = await fetch(`https://telemetria-backend.onrender.com/api/archivos/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                setArchivos(archivos.filter(a => a._id !== id));
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            }
        }
    };

    const handleEdit = (archivo) => {
        setForm({
            nombre: archivo.nombre,
            descripcion: archivo.descripcion,
            link: archivo.link || ""
        });
        setEditId(archivo._id);
        setShowForm(true);
    };

    // Filtrar archivos por nombre
    const archivosFiltrados = archivos.filter(a =>
        a.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Buscador</h2>
            {/* Buscador */}
            <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="border rounded px-3 py-2 mb-4 w-full max-w-md"
            />
            {token && (
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-700 text-white px-4 py-2 rounded mb-4"
                >
                    Subir Archivo
                </button>
            )}

            {showForm && token && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4">{editId ? "Editar Archivo" : "Subir Nuevo Archivo"}</h3>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre del archivo"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full mb-4"
                    />
                    <textarea
                        name="descripcion"
                        placeholder="Descripción"
                        value={form.descripcion}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full mb-4"
                    />
                    <input
                        type="text"
                        name="link"
                        placeholder="URL del archivo"
                        value={form.link}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full mb-4"
                    />
                    <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">
                        {editId ? "Actualizar Archivo" : "Subir Archivo"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setForm({ nombre: "", descripcion: "", link: "" });
                            setEditId(null);
                        }}
                        className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
                    >
                        Cancelar
                    </button>
                </form>
            )}

            <table className="min-w-[300px] w-full border border-gray-300 rounded-lg overflow-hidden shadow mt-6">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Nombre</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Descripción</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Archivo</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(archivosFiltrados) ? archivosFiltrados : []).map(archivo => (
                        <tr key={archivo._id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b border-gray-300 text-center">{archivo.nombre}</td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">{archivo.descripcion}</td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">
                                <button
                                    onClick={() => window.open(archivo.link, '_blank')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                >
                                    Ver Archivo
                                </button>
                            </td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">
                                {token && (
                                    <>
                                        <button
                                            onClick={() => handleEdit(archivo)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(archivo._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showSuccess && (
                <div className="fixed top-[20%] z-[100] bg-green-600 text-white px-6 py-3 rounded shadow-lg">
                    ¡Operación exitosa!
                </div>
            )}
        </div>
    );
}