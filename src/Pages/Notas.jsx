import React, { useEffect, useState } from "react";
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export const Notas = () => {
    const [notas, setNotas] = useState([]);
    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        usuario: ""
    });
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);

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
                setShowFormModal(false); // Cierra el modal al guardar
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
                setShowFormModal(false); // Cierra el modal al guardar
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000);
            }
        }
        setForm({ titulo: "", descripcion: "", usuario: "" });
        setEditId(null); // Asegura limpiar el estado de edición
    };

    const handleDelete = async (id) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta nota?");
        if (!confirmar) return;

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

    // Función para exportar a Excel
    const exportarExcel = () => {
        // Prepara los datos
        const datos = notas.map(nota => ({
            Fecha: new Date(nota.fecha_hora).toLocaleString(),
            Título: nota.titulo,
            Descripción: nota.descripcion,
            Usuario: nota.usuario
        }));
        // Crea la hoja y el libro
        const hoja = XLSX.utils.json_to_sheet(datos);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Notas");
        // Genera el archivo y lo descarga
        const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "notas.xlsx");
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* Barra superior con botones */}
            <div className="w-full bg-gray-300 py-3 px-2 flex items-center justify-between shadow mb-8">
                {/* Título a la izquierda */}
                <h1 className="text-black text-xl font-bold flex-1">Notas</h1>
                {/* Botón Agregar Nota al centro */}
                <div className="flex-1 flex justify-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
                        onClick={() => {
                            setForm({ titulo: "", descripcion: "", usuario: "" });
                            setEditId(null);
                            setShowFormModal(true);
                        }}
                    >
                        Agregar Nota
                    </button>
                </div>
                {/* Botón Exportar a Excel a la derecha */}
                <div className="flex-1 flex justify-end">
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        onClick={exportarExcel}
                    >
                        Exportar a Excel
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed top-8 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg">
                    ¡Nota agregada exitosamente!
                </div>
            )}


            {/* Tabla de Notas */}
            <div className="mt-2 w- w-full px-1">
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow">
                    <thead>
                        <tr className="bg-gray-600 text-white">
                            <th className="px-4 py-2 border-b border-gray-300 text-center">Titulo</th>
                            <th className="px-4 py-2 border-b border-gray-300 text-center">Descripcion</th>
                            <th className="px-4 py-2 border-b border-gray-300 text-center">Usuario</th>
                            <th className="px-4 py-2 border-b border-gray-300 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notas.map((nota, idx) => (
                            <tr key={nota._id} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                <td className="px-4 py-2 text-center border-b border-gray-300">{nota.titulo}</td>
                                <td className="px-4 py-2 text-center border-b border-gray-300">{nota.descripcion}</td>
                                <td className="px-4 py-2 text-center border-b border-gray-300">{nota.usuario}</td>
                                <td className="px-4 py-2 text-center border-b border-gray-300">
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded mr-2"
                                        onClick={() => handleDelete(nota._id)}
                                        title="Eliminar"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded"
                                        onClick={() => {
                                            handleEdit(nota);
                                            setShowFormModal(true);
                                        }}
                                        title="Editar"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Formulario mejorado */}
            {showFormModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            {editId ? "Editar Nota" : "Agregar Nueva Nota"}
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="titulo">
                                    Título
                                </label>
                                <input
                                    id="titulo"
                                    name="titulo"
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Ej: Revisión de sensores"
                                    value={form.titulo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="descripcion">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                    placeholder="Describe la nota aquí..."
                                    value={form.descripcion}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="usuario">
                                    Usuario
                                </label>
                                <input
                                    id="usuario"
                                    name="usuario"
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Tu nombre"
                                    value={form.usuario}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-3 py-1 rounded"
                                    onClick={() => {
                                        setShowFormModal(false);
                                        setEditId(null);
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
                                >
                                    {editId ? "Actualizar Nota" : "Agregar Nota"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notas;