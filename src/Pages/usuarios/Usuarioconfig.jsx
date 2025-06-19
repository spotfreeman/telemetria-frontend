import React, { useEffect, useState } from "react";

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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("https://telemetria-backend.onrender.com/api/usuarios/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setForm(f => ({
                    ...f,
                    username: data.username || "",
                    email: data.email || "",
                    nombre: data.nombre || "",
                    apellido: data.apellido || "",
                    departamento: data.departamento || "",
                    rol: data.rol || "",
                    fechaCreacion: data.fechaCreacion ? new Date(data.fechaCreacion).toLocaleString() : "",
                    activo: data.activo
                }));
            });
    }, []);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMensaje("");
        if (form.password && form.password !== form.confirmarPassword) {
            setMensaje("Las contraseñas no coinciden.");
            return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const body = {
            email: form.email,
            nombre: form.nombre,
            apellido: form.apellido,
            departamento: form.departamento,
            rol: form.rol
        };
        if (form.password) body.password = form.password;

        const res = await fetch("https://telemetria-backend.onrender.com/api/usuarios/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        setLoading(false);
        if (res.ok) {
            setMensaje("¡Datos actualizados correctamente!");
            setForm({ ...form, password: "", confirmarPassword: "" });
        } else {
            setMensaje("Error al actualizar los datos.");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white rounded shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Configuración de Usuario</h2>
            <div className="mb-6">
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
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Guardando..." : "Actualizar"}
                </button>
                {mensaje && (
                    <div className={`mt-2 text-center ${mensaje.startsWith("¡") ? "text-green-600" : "text-red-600"}`}>
                        {mensaje}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Usuarioconfig;