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

        // Cargar datos del localStorage (datos disponibles del login)
        const usuario = localStorage.getItem("usuario");
        const nombre = localStorage.getItem("nombre");
        const rol = localStorage.getItem("rol");
        
        setForm(f => ({
            ...f,
            username: usuario || "",
            nombre: nombre || "",
            rol: rol || "",
            fechaCreacion: new Date().toLocaleString(), // Fecha actual como placeholder
            activo: true // Asumir que está activo si tiene token
        }));
        
        setLoadingData(false);
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
            // Simular actualización (ya que el endpoint no existe en el backend)
            // En una implementación real, aquí harías la petición al backend
            
            // Actualizar localStorage con los nuevos datos
            if (form.nombre) {
                localStorage.setItem("nombre", form.nombre);
            }
            if (form.rol) {
                localStorage.setItem("rol", form.rol);
            }
            
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setMensaje("¡Datos actualizados correctamente! (Nota: Los cambios se guardan localmente)");
            setForm({ ...form, password: "", confirmarPassword: "" });
            
        } catch (err) {
            setError("Error al actualizar los datos.");
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
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded text-sm">
                <strong>Nota:</strong> Los datos se cargan desde la sesión actual y los cambios se guardan localmente. 
                Para una funcionalidad completa, el backend necesita implementar el endpoint de perfil de usuario.
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