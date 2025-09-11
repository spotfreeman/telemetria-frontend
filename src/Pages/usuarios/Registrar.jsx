import React, { useState } from "react";

const Registrar = () => {
    const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "usuario" });
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMensaje("");
        setError("");
        try {
            const res = await fetch("https://telemetria-backend.onrender.com/api/usuarios/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setMensaje("Usuario registrado correctamente");
                setForm({ nombre: "", email: "", password: "", rol: "usuario" });
            } else {
                setError(data.error || "Error al registrar usuario");
            }
        } catch (err) {
            setError("Error de red");
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
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
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
                <button className="bg-blue-700 text-white py-2 rounded hover:bg-blue-800" type="submit">
                    Registrar
                </button>
            </form>
        </div>
    );
};

export default Registrar;