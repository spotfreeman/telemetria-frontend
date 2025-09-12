import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        if (!form.username || !form.password) {
            setError("Completa todos los campos.");
            return;
        }

        setLoading(true);
        console.log("Informacion enviada ", form);

        try {
            const res = await fetch("https://telemetria-backend.onrender.com/api/usuarios/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            console.log(data);

            if (res.ok && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("usuario", data.usuario);
                localStorage.setItem("nombre", data.nombre || data.usuario); // Usar usuario como fallback si no hay nombre
                localStorage.setItem("rol", data.rol);
                navigate("/bienvenida"); // Redirige a la página principal
            } else {
                setError(data.message || "Usuario o contraseña incorrectos");
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor.");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                {error && <div className="mb-4 text-red-600">{error}</div>}
                <input
                    className="border p-2 rounded w-full mb-4"
                    name="username"
                    placeholder="Usuario"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    className="border p-2 rounded w-full mb-4"
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button
                    className="bg-blue-700 text-white px-4 py-2 rounded w-full flex justify-center items-center gap-2 disabled:opacity-50"
                    type="submit"
                    disabled={loading}
                >
                    {loading && (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    )}
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="text-blue-600 hover:underline font-semibold"
                        onClick={() => navigate("/register")}
                    >
                        ¿No tienes cuenta? Regístrate aquí
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;