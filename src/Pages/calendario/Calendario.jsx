import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {
    CalendarDaysIcon,
    UserIcon,
    DocumentTextIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XMarkIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export const Calendario = () => {
    const [value, setValue] = useState([new Date(), new Date()]);
    const [usuario, setUsuario] = useState("");
    const [motivo, setMotivo] = useState("");
    const [vacaciones, setVacaciones] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchVacaciones = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch('https://telemetria-backend.onrender.com/api/vacaciones', {
                    headers: token ? { "Authorization": `Bearer ${token}` } : {}
                });
                if (res.ok) {
                    const data = await res.json();
                    setVacaciones(Array.isArray(data) ? data : []);
                } else {
                    throw new Error('Error al cargar las vacaciones');
                }
            } catch (err) {
                setError(err.message);
                setVacaciones([]);
            } finally {
                setLoading(false);
            }
        };
        fetchVacaciones();
    }, [token]);

    const handleRegistrar = async (e) => {
        e.preventDefault();
        if (!token) return;
        const body = {
            usuario,
            desde: value[0],
            hasta: value[1],
            motivo
        };
        const url = editId
            ? `https://telemetria-backend.onrender.com/api/vacaciones/${editId}`
            : 'https://telemetria-backend.onrender.com/api/vacaciones';
        const method = editId ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            const nueva = await res.json();
            if (editId) {
                setVacaciones(vacaciones.map(v => v._id === editId ? nueva : v));
                setEditId(null);
            } else {
                setVacaciones([...vacaciones, nueva]);
            }
            setMotivo("");
            setUsuario("");
            setShowSuccess(true); // Mostrar modal
            setTimeout(() => setShowSuccess(false), 2000); // Ocultar después de 2 segundos
        }
    };

    const handleEliminar = async (id) => {
        if (!token) return;
        if (!window.confirm("¿Eliminar este registro de vacaciones?")) return;
        const res = await fetch(`https://telemetria-backend.onrender.com/api/vacaciones/${id}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            setVacaciones(vacaciones.filter(v => v._id !== id));
        }
    };

    const handleEditar = (vac) => {
        setValue([new Date(vac.desde), new Date(vac.hasta)]);
        setMotivo(vac.motivo || "");
        setUsuario(vac.usuario || "");
        setEditId(vac._id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <CalendarDaysIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Cargando calendario...</h2>
                    <p className="text-gray-500">Obteniendo información de vacaciones</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <XMarkIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar calendario</h2>
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
                        <CalendarDaysIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Calendario de Vacaciones
                    </h1>
                    <p className="text-gray-600 mt-2">Gestiona y visualiza las vacaciones del equipo</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Columna izquierda: Calendario y formulario */}
                    <div className="space-y-6">
                        {/* Calendario */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <CalendarDaysIcon className="w-5 h-5 mr-2 text-blue-600" />
                                Seleccionar Fechas
                            </h2>
                            <div className="flex justify-center">
                                <Calendar
                                    onChange={setValue}
                                    value={value}
                                    selectRange={true}
                                    className="react-calendar"
                                />
                            </div>
                        </div>

                        {/* Formulario */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <PlusIcon className="w-5 h-5 mr-2 text-green-600" />
                                {editId ? "Editar Vacaciones" : "Registrar Vacaciones"}
                            </h2>

                            <form onSubmit={handleRegistrar} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <UserIcon className="w-4 h-4 inline mr-1" />
                                        Nombre del Usuario
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ingresa el nombre del usuario"
                                        value={usuario}
                                        onChange={e => setUsuario(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        <ClockIcon className="w-4 h-4 mr-1" />
                                        Período Seleccionado
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">Desde:</span>
                                            <p className="text-gray-800">{value[0]?.toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Hasta:</span>
                                            <p className="text-gray-800">{value[1]?.toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <DocumentTextIcon className="w-4 h-4 inline mr-1" />
                                        Motivo (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Descripción del motivo de las vacaciones"
                                        value={motivo}
                                        onChange={e => setMotivo(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        disabled={!value[0] || !value[1] || !usuario}
                                    >
                                        {editId ? "Actualizar Vacaciones" : "Registrar Vacaciones"}
                                    </button>

                                    {editId && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditId(null); setMotivo(""); setUsuario(""); }}
                                            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Columna derecha: Listado */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                            Vacaciones Registradas ({vacaciones.length})
                        </h2>

                        {vacaciones.length === 0 ? (
                            <div className="text-center py-12">
                                <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No hay vacaciones registradas</p>
                                <p className="text-gray-400 text-sm">Usa el formulario para registrar las primeras vacaciones</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {vacaciones.map((v) => (
                                    <div key={v._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <UserIcon className="w-4 h-4 text-blue-600 mr-2" />
                                                    <span className="font-semibold text-gray-900">{v.usuario}</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                                                    <div>
                                                        <span className="font-medium text-gray-600">Desde:</span>
                                                        <p className="text-gray-800">{new Date(v.desde).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-600">Hasta:</span>
                                                        <p className="text-gray-800">{new Date(v.hasta).toLocaleDateString()}</p>
                                                    </div>
                                                </div>

                                                {v.motivo && (
                                                    <div className="text-sm">
                                                        <span className="font-medium text-gray-600">Motivo:</span>
                                                        <p className="text-gray-700 italic">{v.motivo}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => handleEditar(v)}
                                                    className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(v._id)}
                                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast de éxito */}
            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    ¡Registro de vacaciones guardado exitosamente!
                </div>
            )}
        </div>
    );
};

export default Calendario;