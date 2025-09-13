import React, { useEffect, useState } from "react";
import { 
    TrashIcon, 
    PencilSquareIcon, 
    PlusIcon,
    DocumentArrowDownIcon,
    DocumentTextIcon,
    UserIcon,
    CalendarIcon,
    MagnifyingGlassIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
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
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/notas')
            .then(res => res.json())
            .then(setNotas);
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Función para filtrar notas
    const filteredNotas = notas.filter(nota =>
        nota.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nota.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nota.usuario.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Enviar nueva nota o editar
    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        
        try {
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
                    setShowFormModal(false);
                    setShowModal(true);
                    setTimeout(() => setShowModal(false), 3000);
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
                    setShowFormModal(false);
                    setShowModal(true);
                    setTimeout(() => setShowModal(false), 3000);
                }
            }
            setForm({ titulo: "", descripcion: "", usuario: "" });
            setEditId(null);
        } catch (error) {
            console.error('Error al guardar nota:', error);
        } finally {
            setLoading(false);
        }
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                        <DocumentTextIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Gestión de Notas
                    </h1>
                    <p className="text-gray-600 mt-2">Organiza y gestiona tus notas de manera eficiente</p>
                </div>

                {/* Toolbar */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Búsqueda */}
                        <div className="relative flex-1 max-w-md">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar notas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setForm({ titulo: "", descripcion: "", usuario: "" });
                                    setEditId(null);
                                    setShowFormModal(true);
                                }}
                                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Nueva Nota
                            </button>
                            
                            <button
                                onClick={exportarExcel}
                                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notificación de éxito */}
                {showModal && (
                    <div className="fixed top-8 right-8 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-slide-in">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>¡Nota guardada exitosamente!</span>
                    </div>
                )}

                {/* Lista de Notas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotas.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DocumentTextIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                {searchTerm ? "No se encontraron notas" : "No hay notas disponibles"}
                            </h3>
                            <p className="text-gray-500">
                                {searchTerm ? "Intenta con otros términos de búsqueda" : "Crea tu primera nota para comenzar"}
                            </p>
                        </div>
                    ) : (
                        filteredNotas.map((nota, idx) => (
                            <div
                                key={nota._id}
                                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                {/* Header de la nota */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                                            {nota.titulo}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                                            <div className="flex items-center">
                                                <UserIcon className="w-4 h-4 mr-1" />
                                                {nota.usuario}
                                            </div>
                                            <div className="flex items-center">
                                                <CalendarIcon className="w-4 h-4 mr-1" />
                                                {new Date(nota.fecha_hora).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Botones de acción */}
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => {
                                                handleEdit(nota);
                                                setShowFormModal(true);
                                            }}
                                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors duration-200"
                                            title="Editar"
                                        >
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(nota._id)}
                                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-200"
                                            title="Eliminar"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Contenido de la nota */}
                                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                    {nota.descripcion}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal del formulario */}
                {showFormModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                            {/* Header del modal */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {editId ? "Editar Nota" : "Nueva Nota"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowFormModal(false);
                                        setEditId(null);
                                        setForm({ titulo: "", descripcion: "", usuario: "" });
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título
                                    </label>
                                    <input
                                        name="titulo"
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        placeholder="Ej: Revisión de sensores"
                                        value={form.titulo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                                        placeholder="Describe la nota aquí..."
                                        value={form.descripcion}
                                        onChange={handleChange}
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Usuario
                                    </label>
                                    <input
                                        name="usuario"
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        placeholder="Tu nombre"
                                        value={form.usuario}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Botones */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowFormModal(false);
                                            setEditId(null);
                                            setForm({ titulo: "", descripcion: "", usuario: "" });
                                        }}
                                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Guardando...
                                            </div>
                                        ) : (
                                            editId ? "Actualizar" : "Crear Nota"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notas;