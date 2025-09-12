import React, { useState } from "react";

export const Registrar = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        rol: "usuario",
        nombre: "",
        apellido: "",
        departamento: ""
    });
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMensaje("");
        setError("");

        // Validar campos vacíos
        if (!form.username || !form.email || !form.password || !form.nombre) {
            setError("Por favor, completa todos los campos obligatorios");
            return;
        }

        // Validar longitud de contraseña
        if (form.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("https://telemetria-backend.onrender.com/api/usuarios/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setMensaje(data.message || "Usuario registrado correctamente");
                setForm({
                    username: "",
                    email: "",
                    password: "",
                    rol: "usuario",
                    nombre: "",
                    apellido: "",
                    departamento: ""
                });
            } else {
                setError(data.error || data.message || "Error al registrar usuario");
            }
        } catch (err) {
            console.error("Error de conexión:", err);
            setError("Error de conexión. Verifica tu conexión a internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Registrar Usuario</h2>
            {mensaje && <div className="mb-4 text-green-700">{mensaje}</div>}
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Nombre de usuario"
                    value={form.username}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                    required
                />
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                    required
                />
                <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                />
                <input
                    type="text"
                    name="departamento"
                    placeholder="Departamento"
                    value={form.departamento}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                    required
                />
                <select
                    name="rol"
                    value={form.rol}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>
                <button
                    className="bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    type="submit"
                    disabled={loading}
                >
                    {loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {loading ? "Registrando..." : "Registrar"}
                </button>
            </form>
        </div>
    );
};

export default Registrar;