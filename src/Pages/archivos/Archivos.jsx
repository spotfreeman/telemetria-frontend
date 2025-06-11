import React, { useEffect, useState } from "react";

export const Archivos = () => {
    const [archivos, setArchivos] = useState([]);
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        archivo: null
    });
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/archivos')
            .then(res => res.json())
            .then(data => {
                // Si la respuesta es un objeto con una propiedad 'archivos', usa esa propiedad
                if (Array.isArray(data)) {
                    setArchivos(data);
                } else if (Array.isArray(data.archivos)) {
                    setArchivos(data.archivos);
                } else {
                    setArchivos([]);
                }
            })
            .catch(() => setArchivos([]));
    }, []);

    const handleChange = e => {
        if (e.target.name === "archivo") {
            setForm({ ...form, archivo: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    // Enviar nuevo archivo o editar
    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nombre", form.nombre);
        formData.append("descripcion", form.descripcion);
        if (form.archivo) {
            formData.append("archivo", form.archivo);
        }

        if (editId) {
            // Editar archivo existente
            const res = await fetch(`https://telemetria-backend.onrender.com/api/archivos/${editId}`, {
                method: 'PUT',
                body: formData
            });
            if (res.ok) {
                const archivoActualizado = await res.json();
                setArchivos(archivos.map(a => a._id === editId ? archivoActualizado : a));
                setEditId(null);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            }
        } else {
            // Crear nuevo archivo
            const res = await fetch('https://telemetria-backend.onrender.com/api/archivos', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const archivoGuardado = await res.json();
                setArchivos([archivoGuardado, ...archivos]);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            }
        }
        setForm({ nombre: "", descripcion: "", archivo: null });
    };

    const handleDelete = async (id) => {
        if (window.confirm
            ("¿Estás seguro de que deseas eliminar este archivo?")) {
            const res = await fetch(`https://telemetria-backend.onrender.com/api/archivos/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setArchivos(archivos.filter(a => a._id !== id));
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            }
        }
    }
        ;
    const handleEdit = (archivo) => {
        setForm({
            nombre: archivo.nombre,
            descripcion: archivo.descripcion,
            archivo: null
        });
        setEditId(archivo._id);
    };

    return (
        <div className="flex flex-col items-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Archivos</h2>
            <button
                onClick={() => setShowForm(true)}
                className="bg-blue-700 text-white px-4 py-2 rounded mb-4"
            >
                Subir Archivo
            </button>

            {showForm && (
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
                        type="file"
                        name="archivo"
                        onChange={handleChange}
                        accept=".txt,.pdf,.docx,.xlsx,.jpg,.png,.zip"
                        className="mb-4"
                    />
                    <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">
                        {editId ? "Actualizar Archivo" : "Subir Archivo"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setForm({ nombre: "", descripcion: "", archivo: null });
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
                        <th className="px-4 py-2 border-b border-gray-300 text-center">ID</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Nombre</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Descripción</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Archivo</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(archivos) ? archivos : []).map(archivo => (
                        <tr key={archivo._id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b border-gray-300 text-center">{archivo._id}</td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">{archivo.nombre}</td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">{archivo.descripcion}</td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">
                                <button
                                    onClick={() => window.open(archivo.url, '_blank')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                >
                                    Ver Archivo
                                </button>
                            </td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">
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