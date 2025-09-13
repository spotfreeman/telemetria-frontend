import React, { useEffect, useState } from "react";
import { 
    DocumentIcon, 
    MagnifyingGlassIcon, 
    PlusIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

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
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener token del localStorage
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchArchivos = async () => {
            try {
                setLoading(true);
                setError(null);
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
                    throw new Error('Error al cargar los archivos');
                }
            } catch (err) {
                setError(err.message);
                setArchivos([]);
            } finally {
                setLoading(false);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <DocumentIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Cargando archivos...</h2>
                    <p className="text-gray-500">Obteniendo información de archivos</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar archivos</h2>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                        <DocumentIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Gestión de Archivos
                    </h1>
                    <p className="text-gray-600 mt-2">Organiza y gestiona todos los archivos del proyecto</p>
                </div>

                {/* Toolbar */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Buscador */}
                        <div className="relative flex-1 max-w-md">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar archivos por nombre..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Botón de agregar */}
                        {token && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Subir Archivo
                            </button>
                        )}
                    </div>
                </div>

                {/* Modal de formulario */}
                {showForm && token && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <DocumentIcon className="w-6 h-6 mr-2 text-blue-600" />
                                        {editId ? "Editar Archivo" : "Subir Nuevo Archivo"}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowForm(false);
                                            setForm({ nombre: "", descripcion: "", link: "" });
                                            setEditId(null);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre del Archivo
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder="Ingresa el nombre del archivo"
                                            value={form.nombre}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descripción
                                        </label>
                                        <textarea
                                            name="descripcion"
                                            placeholder="Describe el contenido del archivo"
                                            value={form.descripcion}
                                            onChange={handleChange}
                                            required
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL del Archivo
                                        </label>
                                        <input
                                            type="url"
                                            name="link"
                                            placeholder="https://ejemplo.com/archivo.pdf"
                                            value={form.link}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                        >
                                            {editId ? "Actualizar Archivo" : "Subir Archivo"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setForm({ nombre: "", descripcion: "", link: "" });
                                                setEditId(null);
                                            }}
                                            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de archivos */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <DocumentIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Archivos Disponibles ({archivosFiltrados.length})
                    </h2>

                    {archivosFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <DocumentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                                {busqueda ? "No se encontraron archivos" : "No hay archivos disponibles"}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {busqueda ? "Intenta con otro término de búsqueda" : "Sube el primer archivo para comenzar"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {archivosFiltrados.map(archivo => (
                                <div key={archivo._id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                            <DocumentIcon className="w-6 h-6 text-white" />
                                        </div>
                                        {token && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(archivo)}
                                                    className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(archivo._id)}
                                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {archivo.nombre}
                                    </h3>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {archivo.descripcion}
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => window.open(archivo.link, '_blank')}
                                            className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                        >
                                            <EyeIcon className="w-4 h-4 mr-2" />
                                            Ver Archivo
                                        </button>
                                        <button
                                            onClick={() => window.open(archivo.link, '_blank')}
                                            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                                            title="Descargar"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Toast de éxito */}
            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    ¡Operación exitosa!
                </div>
            )}
        </div>
    );
}