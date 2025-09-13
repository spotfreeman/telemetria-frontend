import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Usuarioconfig = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        nombre: "",
        apellido: "",
        departamento: "",
        rol: "",
        fechaCreacion: "",
        activo: false,
        password: "",
        confirmarPassword: ""
    });
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Cargar datos del usuario desde el backend
        const loadUserProfile = async () => {
            try {
                const response = await fetch("https://telemetria-backend.onrender.com/api/auth/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const userData = data.data; // El backend devuelve los datos en data.data
                    console.log("Datos del usuario cargados:", userData);
                    console.log("Rol del usuario:", userData.rol);
                    setForm(f => ({
                        ...f,
                        username: userData.username || "",
                        email: userData.email || "",
                        nombre: userData.nombre || "",
                        apellido: userData.apellido || "",
                        departamento: userData.departamento || "",
                        rol: userData.rol || "",
                        fechaCreacion: userData.createdAt ? new Date(userData.createdAt).toLocaleString() : new Date().toLocaleString(),
                        activo: userData.activo !== undefined ? userData.activo : true
                    }));
                } else if (response.status === 401) {
                    // Token expirado o inválido
                    localStorage.removeItem("token");
                    localStorage.removeItem("usuario");
                    localStorage.removeItem("nombre");
                    localStorage.removeItem("rol");
                    navigate("/login");
                    return;
                } else {
                    // Error del servidor, cargar datos del localStorage como fallback
                    const usuario = localStorage.getItem("usuario");
                    const nombre = localStorage.getItem("nombre");
                    const rol = localStorage.getItem("rol");

                    setForm(f => ({
                        ...f,
                        username: usuario || "",
                        nombre: nombre || "",
                        rol: rol || "",
                        fechaCreacion: new Date().toLocaleString(),
                        activo: true
                    }));
                }
            } catch (error) {
                console.error("Error al cargar perfil:", error);
                // Fallback a datos del localStorage
                const usuario = localStorage.getItem("usuario");
                const nombre = localStorage.getItem("nombre");
                const rol = localStorage.getItem("rol");

                setForm(f => ({
                    ...f,
                    username: usuario || "",
                    nombre: nombre || "",
                    rol: rol || "",
                    fechaCreacion: new Date().toLocaleString(),
                    activo: true
                }));
            } finally {
                setLoadingData(false);
            }
        };

        loadUserProfile();
    }, [navigate]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMensaje("");
        setError("");

        if (form.password && form.password !== form.confirmarPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (form.password && form.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
            setError("No hay token de autenticación. Por favor, inicia sesión nuevamente.");
            setLoading(false);
            return;
        }

        try {
            // Preparar datos para enviar al backend
            const updateData = {
                nombre: form.nombre,
                apellido: form.apellido,
                email: form.email,
                departamento: form.departamento,
                rol: form.rol
            };

            // Si se proporciona una nueva contraseña, incluirla
            if (form.password) {
                updateData.password = form.password;
            }

            // Debug: Imprimir los datos que se van a enviar
            console.log("Datos del perfil a actualizar:", updateData);
            console.log("Rol seleccionado:", form.rol);

            const response = await fetch("https://telemetria-backend.onrender.com/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Respuesta del servidor (perfil):", data);
                console.log("Status de la respuesta:", response.status);

                // Actualizar localStorage con los nuevos datos
                if (form.nombre) {
                    localStorage.setItem("nombre", form.nombre);
                }
                if (form.rol) {
                    localStorage.setItem("rol", form.rol);
                }

                setMensaje("¡Datos actualizados correctamente!");
                setForm({ ...form, password: "", confirmarPassword: "" });
            } else if (response.status === 401) {
                // Token expirado
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
                localStorage.removeItem("nombre");
                localStorage.removeItem("rol");
                navigate("/login");
                return;
            } else {
                const errorData = await response.json();
                setError(errorData.error || errorData.message || "Error al actualizar los datos");
            }

        } catch (err) {
            console.error("Error al actualizar perfil:", err);
            setError("Error de conexión. Verifica tu conexión a internet.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="max-w-lg mx-auto mt-10 bg-white rounded shadow p-6">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Cargando datos del usuario...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Mi Perfil
                    </h1>
                    <p className="text-gray-600 mt-2">Gestiona tu información personal</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Información del Usuario */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Información
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Usuario</p>
                                        <p className="font-semibold text-gray-800">{form.username}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Miembro desde</p>
                                        <p className="font-semibold text-gray-800">{form.fechaCreacion}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Estado</p>
                                        <p className="font-semibold text-gray-800">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${form.activo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {form.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Nota informativa */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Funcionalidad Completa</p>
                                        <p className="text-xs text-green-700 mt-1">Los datos se cargan desde el backend y los cambios se guardan en la base de datos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de Edición */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar Perfil
                            </h3>

                            {/* Mostrar errores */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Mostrar mensajes de éxito */}
                            {mensaje && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {mensaje}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Grid de campos */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nombre */}
                                    <div className="space-y-2">
                                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                                            Nombre
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="nombre"
                                                name="nombre"
                                                type="text"
                                                value={form.nombre}
                                                onChange={handleChange}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Apellido */}
                                    <div className="space-y-2">
                                        <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                                            Apellido
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="apellido"
                                                name="apellido"
                                                type="text"
                                                value={form.apellido}
                                                onChange={handleChange}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Departamento */}
                                    <div className="space-y-2">
                                        <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">
                                            Departamento
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <input
                                                id="departamento"
                                                name="departamento"
                                                type="text"
                                                value={form.departamento}
                                                onChange={handleChange}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Rol */}
                                    <div className="space-y-2">
                                        <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                                            Rol
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <select
                                                id="rol"
                                                name="rol"
                                                value={form.rol}
                                                onChange={handleChange}
                                                required
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm appearance-none"
                                            >
                                                <option value="">Selecciona un rol</option>
                                                <option value="usuario">Usuario</option>
                                                <option value="admin">Admin</option>
                                                <option value="supervisor">Supervisor</option>
                                                <option value="monitor">Monitor</option>
                                                <option value="visor">Visor</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección de contraseñas */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Cambiar Contraseña
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Nueva contraseña */}
                                        <div className="space-y-2">
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Nueva contraseña
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    value={form.password}
                                                    onChange={handleChange}
                                                    placeholder="Dejar en blanco para no cambiar"
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Confirmar contraseña */}
                                        <div className="space-y-2">
                                            <label htmlFor="confirmarPassword" className="block text-sm font-medium text-gray-700">
                                                Confirmar contraseña
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="confirmarPassword"
                                                    name="confirmarPassword"
                                                    type="password"
                                                    value={form.confirmarPassword}
                                                    onChange={handleChange}
                                                    placeholder="Repite la contraseña"
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de actualizar */}
                                <div className="flex justify-end pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Actualizar Perfil
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Usuarioconfig;