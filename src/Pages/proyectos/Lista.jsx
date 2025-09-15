import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TableLoading, ButtonLoading } from "../../Components/LoadingStates";
import { useRoles } from "../../hooks/useRoles";
import {
    PencilIcon,
    TrashIcon,
    EyeIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    ShieldExclamationIcon,
    UserIcon
} from '@heroicons/react/24/outline';


export const Lista = () => {
    const { canCreateProjects, canEditProjects, canDeleteProjects, userInfo, isAdmin } = useRoles();
    const [proyectos, setProyectos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        codigo: "",
        nombre: "",
        estado: ""
    });
    const [busqueda, setBusqueda] = useState("");
    const [busquedaCodigo, setBusquedaCodigo] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [sortField, setSortField] = useState('nombre');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const res = await fetch('https://telemetria-backend.onrender.com/api/proyectos', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setProyectos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching proyectos:', error);
                setProyectos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProyectos();
    }, []);

    const handleCrearProyecto = () => {
        setShowModal(true);
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const token = localStorage.getItem("token");

            const res = await fetch('https://telemetria-backend.onrender.com/api/proyectos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                const nuevoProyecto = await res.json();
                setProyectos([nuevoProyecto, ...proyectos]);
                setShowModal(false);
                setForm({ codigo: "", nombre: "", estado: "" });
            }
        } catch (error) {
            console.error('Error creating proyecto:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ codigo: "", nombre: "", estado: "" });
    };

    // Filtrado y ordenamiento
    const proyectosFiltrados = Array.isArray(proyectos)
        ? proyectos.filter(p =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
            p.codigo.toLowerCase().includes(busquedaCodigo.toLowerCase())
        )
        : [];

    // Ordenamiento
    const proyectosOrdenados = [...proyectosFiltrados].sort((a, b) => {
        const aValue = a[sortField]?.toString().toLowerCase() || '';
        const bValue = b[sortField]?.toString().toLowerCase() || '';

        if (sortDirection === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });

    // Paginación
    const totalPages = Math.ceil(proyectosOrdenados.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const proyectosPaginados = proyectosOrdenados.slice(startIndex, endIndex);

    // Funciones de ordenamiento
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    // Función para eliminar proyecto
    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setProyectos(proyectos.filter(p => p._id !== id));
            }
        } catch (error) {
            console.error('Error deleting proyecto:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Gestión de Proyectos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                        Administra y supervisa todos tus proyectos desde un solo lugar. Crea nuevos proyectos,
                        realiza seguimiento del progreso y mantén todo organizado.
                    </p>

                    {/* Indicador de rol del usuario */}
                    <div className="mt-4 flex items-center justify-center">
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${isAdmin
                                ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900 dark:to-pink-900 dark:text-purple-200'
                                : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200'
                            }`}>
                            <UserIcon className="w-4 h-4 mr-2" />
                            <span className="font-semibold">{userInfo.nombre}</span>
                            <span className="ml-2 px-2 py-1 rounded-full text-xs bg-white dark:bg-gray-700/50 dark:bg-gray-800/50">
                                {userInfo.rol.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Barra de herramientas */}
                <div className="bg-white dark:bg-gray-700/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Título de la sección */}
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h2 className="text-xl font-semibold text-gray-800">Buscar y Filtrar</h2>
                        </div>

                        {/* Controles de búsqueda */}
                        <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:justify-end">
                            {/* Campo de búsqueda por código */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700/50 backdrop-blur-sm sm:w-64"
                                    placeholder="Buscar por código..."
                                    value={busquedaCodigo}
                                    onChange={e => setBusquedaCodigo(e.target.value)}
                                />
                            </div>

                            {/* Campo de búsqueda por nombre */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700/50 dark:bg-gray-700/50 backdrop-blur-sm sm:w-64 text-gray-900 dark:text-white"
                                    placeholder="Buscar por nombre..."
                                    value={busqueda}
                                    onChange={e => setBusqueda(e.target.value)}
                                />
                            </div>

                            {/* Botón crear proyecto - Solo visible para Admin */}
                            {canCreateProjects ? (
                                <button
                                    onClick={handleCrearProyecto}
                                    className="flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Crear Proyecto
                                </button>
                            ) : (
                                <div className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed">
                                    <ShieldExclamationIcon className="w-5 h-5 mr-2" />
                                    <span>Solo Administradores</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal para crear proyecto */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
                        <div className="bg-white dark:bg-gray-700/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 w-full max-w-lg transform transition-all duration-300 scale-100">
                            {/* Header del modal */}
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Crear Nuevo Proyecto
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Completa la información para crear un nuevo proyecto</p>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Campo Código */}
                                <div className="space-y-2">
                                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Código del Proyecto *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                            </svg>
                                        </div>
                                        <input
                                            id="codigo"
                                            name="codigo"
                                            type="text"
                                            placeholder="Ej: PROJ-2024-001"
                                            value={form.codigo}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700/50 backdrop-blur-sm"
                                        />
                                    </div>
                                </div>

                                {/* Campo Nombre */}
                                <div className="space-y-2">
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nombre del Proyecto *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="nombre"
                                            name="nombre"
                                            type="text"
                                            placeholder="Nombre descriptivo del proyecto"
                                            value={form.nombre}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700/50 backdrop-blur-sm"
                                        />
                                    </div>
                                </div>

                                {/* Campo Estado */}
                                <div className="space-y-2">
                                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Estado Inicial *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <select
                                            id="estado"
                                            name="estado"
                                            value={form.estado}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700/50 backdrop-blur-sm appearance-none"
                                        >
                                            <option value="">Selecciona un estado</option>
                                            <option value="planificacion">Planificación</option>
                                            <option value="en_progreso">En Progreso</option>
                                            <option value="en_revision">En Revisión</option>
                                            <option value="completado">Completado</option>
                                            <option value="pausado">Pausado</option>
                                            <option value="cancelado">Cancelado</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                                    >
                                        Cancelar
                                    </button>
                                    <ButtonLoading
                                        type="submit"
                                        loading={submitting}
                                        className="flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Crear Proyecto
                                    </ButtonLoading>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Tabla de Proyectos */}
                <div className="bg-white dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    {/* Header de la tabla */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Proyectos ({proyectosFiltrados.length})
                                </h3>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Página {currentPage} de {totalPages}
                            </div>
                        </div>
                    </div>

                    {/* Contenido de la tabla */}
                    {loading ? (
                        <TableLoading rows={5} />
                    ) : proyectosPaginados.length > 0 ? (
                        <>
                            {/* Tabla */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                                onClick={() => handleSort('codigo')}
                                            >
                                                <div className="flex items-center">
                                                    Código
                                                    {sortField === 'codigo' && (
                                                        <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                                onClick={() => handleSort('nombre')}
                                            >
                                                <div className="flex items-center">
                                                    Nombre
                                                    {sortField === 'nombre' && (
                                                        <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                                onClick={() => handleSort('estado')}
                                            >
                                                <div className="flex items-center">
                                                    Estado
                                                    {sortField === 'estado' && (
                                                        <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {proyectosPaginados.map((proyecto, idx) => (
                                            <motion.tr
                                                key={proyecto._id || idx}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{proyecto.codigo}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-white font-medium">{proyecto.nombre}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Proyecto de telemetría</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${proyecto.estado === 'completado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                        proyecto.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                            proyecto.estado === 'planificacion' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                                proyecto.estado === 'en_revision' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                                                    proyecto.estado === 'pausado' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                                                        proyecto.estado === 'cancelado' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                                        }`}>
                                                        {proyecto.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            to={`/proyectos/${proyecto._id}`}
                                                            className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                            title="Ver detalles"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleEliminar(proyecto._id)}
                                                            className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                            title="Eliminar"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            Mostrando {startIndex + 1} a {Math.min(endIndex, proyectosOrdenados.length)} de {proyectosOrdenados.length} proyectos
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                Anterior
                                            </button>

                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                const pageNum = i + 1;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${currentPage === pageNum
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {busqueda || busquedaCodigo ? 'No se encontraron proyectos' : 'No hay proyectos aún'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                {busqueda || busquedaCodigo
                                    ? 'Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.'
                                    : 'Comienza creando tu primer proyecto para organizar y gestionar tus tareas.'
                                }
                            </p>
                            {!busqueda && !busquedaCodigo && (
                                <button
                                    onClick={handleCrearProyecto}
                                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Crear Primer Proyecto
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lista;