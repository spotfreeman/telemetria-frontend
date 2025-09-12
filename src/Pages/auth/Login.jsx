import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de Login para la plataforma de Telemetría.
 * Permite a los usuarios autenticarse y guarda el token y datos del usuario en localStorage.
 * Redirige a la página de bienvenida tras un login exitoso.
 */
export const Login2 = () => {
    // Estado para el formulario de login
    const [form, setForm] = useState({ username: "", password: "" });
    // Estado para mostrar errores de autenticación
    const [error, setError] = useState("");
    // Estado para mostrar un loader durante la petición
    const [loading, setLoading] = useState(false);
    // Hook de navegación de React Router
    const navigate = useNavigate();

    /**
     * Maneja los cambios en los campos del formulario.
     * @param {object} e - Evento de cambio de input
     */
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    /**
     * Maneja el envío del formulario de login.
     * Realiza la petición al backend, guarda los datos en localStorage y redirige si es exitoso.
     * @param {object} e - Evento de submit
     */
    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        if (!form.username || !form.password) {
            setError("Completa todos los campos.");
            return;
        }

        setLoading(true);
        //console.log("Informacion enviada ", form);

        // Petición al backend para autenticar usuario
        try {
            const res = await fetch("https://telemetria-backend.onrender.com/api/usuarios/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            //console.log(data);

            if (res.ok && data.token) {
                // El backend devuelve los datos directamente
                localStorage.setItem("token", data.token);
                localStorage.setItem("usuario", data.usuario);
                localStorage.setItem("nombre", data.nombre || data.usuario); // Usar usuario como fallback si no hay nombre
                localStorage.setItem("rol", data.rol);
                localStorage.setItem("email", data.email);

                // Redirige a la página principal
                navigate("/bienvenida");
            } else {
                setError(data.message || data.error || "Usuario o contraseña incorrectos");
            }
        } catch (err) {
            console.error("Error de conexión:", err);
            setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card principal */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Bienvenido
                        </h1>
                        <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Mensaje de error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Campo Usuario */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Usuario
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Ingresa tu usuario"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* Campo Contraseña */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
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
                                    placeholder="Ingresa tu contraseña"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* Botón de Login */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Iniciar Sesión
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes cuenta?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                            >
                                Regístrate aquí
                            </button>
                        </p>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Sistema de Telemetría - Plataforma de Seguimiento de Proyectos
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login2;