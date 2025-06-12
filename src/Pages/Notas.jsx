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
    const [players, setPlayers] = useState([]); // Added state for players

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/notas')
            .then(res => res.json())
            .then(setNotas);

        // Fetch players data (example endpoint)
        fetch('https://example.com/api/players')
            .then(res => res.json())
            .then(setPlayers);
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
        <div className="flex flex-col items-center mt-1 w-full">
            {/* Barra superior con botones */}
            <div className="w-full bg-gray-600 py-3 px-4 flex items-center justify-between shadow mb-8">
                {/* Título a la izquierda */}
                <h1 className="text-white text-xl font-bold flex-1">Notas</h1>
                {/* Botón Agregar Nota al centro */}
                <div className="flex-1 flex justify-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
                        onClick={() => {
                            setForm({ titulo: "", descripcion: "", usuario: "" });
                            setEditId(null);
                            // Aquí podrías mostrar un modal o enfocar el formulario
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

            {/* Barra superior 2 */}
            <div className="w-full bg-emerald-700 py-3 px-4 flex items-center justify-between shadow mb-8">
                {/* Título a la izquierda */}
                <div className="flex-1 flex justify-start">
                    <h1 className="text-white text-xl font-bold flex-1">Izquierda</h1>
                </div>
                {/* Botón Agregar Nota al centro */}
                <div className="flex-1 flex justify-center">
                    <h1 className="text-white text-xl font-bold flex-1">Centro</h1>
                </div>
                {/* Botón Exportar a Excel a la derecha */}
                <div className="flex-1 flex justify-end">
                    <h1 className="text-white text-xl font-bold flex-1">Derecha</h1>
                </div>
            </div>


            {showModal && (
                <div className="fixed top-8 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg">
                    ¡Nota agregada exitosamente!
                </div>
            )}

            <h2 className="text-2xl font-bold mb-8 w-full text-center">Notas</h2>
            <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8">
                {/* Columna del formulario */}
                <div className="md:basis-1/3 w-full">
                    <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 w-full max-w-md mx-auto">
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
                </div>

                {/* Columna de la tabla 
                <div className="md:basis-2/3 w-full">
                    <table className="min-w-[300px] w-full border border-gray-300 rounded-lg overflow-hidden shadow">
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
                                            className="bg-red-600 hover:bg-red-700 text-white p-1 rounded mr-2"
                                            onClick={() => handleDelete(nota._id)}
                                            title="Eliminar"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded"
                                            onClick={() => handleEdit(nota)}
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
                */}
            </div>

            {/* Tabla de Notas */}
            <div className="mt-8 w-full">
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
                                        onClick={() => handleEdit(nota)}
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
        </div>
    );
};

export default Notas;