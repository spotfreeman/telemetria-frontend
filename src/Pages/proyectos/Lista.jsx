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
    const [busqueda, setBusqueda] = useState("");
    const [busquedaCodigo, setBusquedaCodigo] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch('https://telemetria-backend.onrender.com/api/proyectos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setProyectos(Array.isArray(data) ? data : []);
            });
    }, []);

    const handleCrearProyecto = () => {
        setShowModal(true);
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem("token"); // Obtén el token guardado

        const res = await fetch('https://telemetria-backend.onrender.com/api/proyectos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Agrega el token aquí
            },
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

    // Filtrado por nombre
    const proyectosFiltrados = Array.isArray(proyectos)
        ? proyectos.filter(p =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
            p.codigo.toLowerCase().includes(busquedaCodigo.toLowerCase())
        )
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
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
                    <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                        Administra y supervisa todos tus proyectos desde un solo lugar. Crea nuevos proyectos, 
                        realiza seguimiento del progreso y mantén todo organizado.
                    </p>
                </div>

                {/* Barra de herramientas */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
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
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm sm:w-64"
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
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm sm:w-64"
                                    placeholder="Buscar por nombre..."
                                    value={busqueda}
                                    onChange={e => setBusqueda(e.target.value)}
                                />
                            </div>

                            {/* Botón crear proyecto */}
                            <button
                                onClick={handleCrearProyecto}
                                className="flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Crear Proyecto
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal para crear proyecto */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-lg transform transition-all duration-300 scale-100">
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
                                <p className="text-gray-600 mt-2">Completa la información para crear un nuevo proyecto</p>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Campo Código */}
                                <div className="space-y-2">
                                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
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
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                                        />
                                    </div>
                                </div>

                                {/* Campo Nombre */}
                                <div className="space-y-2">
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
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
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                                        />
                                    </div>
                                </div>

                                {/* Campo Estado */}
                                <div className="space-y-2">
                                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
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
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm appearance-none"
                                        >
                                            <option value="">Selecciona un estado</option>
                                            <option value="Planificación">Planificación</option>
                                            <option value="En Progreso">En Progreso</option>
                                            <option value="En Revisión">En Revisión</option>
                                            <option value="Completado">Completado</option>
                                            <option value="Pausado">Pausado</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Crear Proyecto
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Lista de Proyectos */}
                <div className="space-y-6">
                    {/* Header de la lista */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Proyectos ({proyectosFiltrados.length})
                            </h3>
                        </div>
                    </div>

                    {/* Grid de proyectos */}
                    {proyectosFiltrados.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {proyectosFiltrados.map((proyecto, idx) => (
                                <div
                                    key={proyecto._id || idx}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group"
                                >
                                    {/* Header del card */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Código</p>
                                                <p className="text-lg font-bold text-gray-800">{proyecto.codigo}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Estado badge */}
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            proyecto.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                                            proyecto.estado === 'En Progreso' ? 'bg-blue-100 text-blue-800' :
                                            proyecto.estado === 'Planificación' ? 'bg-yellow-100 text-yellow-800' :
                                            proyecto.estado === 'En Revisión' ? 'bg-purple-100 text-purple-800' :
                                            proyecto.estado === 'Pausado' ? 'bg-orange-100 text-orange-800' :
                                            proyecto.estado === 'Cancelado' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {proyecto.estado}
                                        </span>
                                    </div>

                                    {/* Contenido del card */}
                                    <div className="mb-4">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                            {proyecto.nombre}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Proyecto creado y gestionado desde la plataforma de telemetría
                                        </p>
                                    </div>

                                    {/* Footer del card */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Proyecto
                                        </div>
                                        
                                        <Link
                                            to={`/proyectos/${proyecto._id}`}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                                        >
                                            Ver Detalles
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Estado vacío */
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {busqueda || busquedaCodigo ? 'No se encontraron proyectos' : 'No hay proyectos aún'}
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
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