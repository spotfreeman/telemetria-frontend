import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        console.log("Informacion enviada ", form);

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
            navigate("/bienvenida"); // Redirige a la página principal
        } else {
            setError(data.message || "Usuario o contraseña incorrectos");
        }
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
                <button className="bg-blue-700 text-white px-4 py-2 rounded w-full" type="submit">
                    Ingresar
                </button>
            </form>
        </div>
    );
};

export default Login;