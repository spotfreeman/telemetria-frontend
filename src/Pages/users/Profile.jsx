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
        <div className="max-w-lg mx-auto mt-10 bg-white rounded shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Configuración de Usuario</h2>

            {/* Nota informativa */}
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
                <strong>✅ Funcionalidad Completa:</strong> Los datos se cargan desde el backend y los cambios se guardan en la base de datos.
            </div>

            {/* Mostrar errores */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Mostrar mensajes de éxito */}
            {mensaje && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {mensaje}
                </div>
            )}

            <div className="mb-6 p-4 bg-gray-50 rounded">
                <div className="mb-2"><span className="font-semibold">Usuario:</span> {form.username}</div>
                <div className="mb-2"><span className="font-semibold">Fecha de creación:</span> {form.fechaCreacion}</div>
                <div className="mb-2"><span className="font-semibold">Activo:</span> {form.activo ? "Sí" : "No"}</div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1 font-medium">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Apellido</label>
                    <input
                        type="text"
                        name="apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Departamento</label>
                    <input
                        type="text"
                        name="departamento"
                        value={form.departamento}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Rol</label>
                    <select
                        name="rol"
                        value={form.rol}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    >
                        <option value="">Selecciona un rol</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Visita">Visita</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Nueva contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Dejar en blanco para no cambiar"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Confirmar contraseña</label>
                    <input
                        type="password"
                        name="confirmarPassword"
                        value={form.confirmarPassword}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Repite la contraseña"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={loading}
                >
                    {loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {loading ? "Guardando..." : "Actualizar"}
                </button>
            </form>
        </div>
    );
};

export default Usuarioconfig;