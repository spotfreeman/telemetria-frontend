import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login2 = () => {

    const [form, setForm] = useState({ email: "", password: "" });
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
            localStorage.setItem("nombre", data.nombre);
            navigate("/bienvenida"); // Redirige a la página principal
        } else {
            setError(data.message || "Usuario o contraseña incorrectos");
        }
    };

    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
            <div className="flex min-h-full flex-1">
                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <img
                                alt="ROB Studios"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-10 w-auto"
                            />
                            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Inicio de Sesion</h2>

                        </div>

                        <div className="mt-10">
                            <div>
                                <form onSubmit={handleSubmit} action="#" method="POST" className="space-y-6">
                                    <div>
                                        <label htmlFor="text" className="block text-sm font-medium text-gray-900">
                                            Nombre de usuario
                                        </label>

                                        {error && <div className="mb-4 text-red-600">{error}</div>}

                                        <div className="mt-2">
                                            <input
                                                id="username"
                                                name="username"
                                                placeholder="Usuario"
                                                type="text"
                                                value={form.username}
                                                onChange={handleChange}
                                                required
                                                autoComplete="text"
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                            Password
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="Contraseña"
                                                value={form.password}
                                                onChange={handleChange}
                                                required
                                                autoComplete="current-password"
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            disabled={loading}
                                        >
                                            {loading && (
                                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                            )}
                                            {loading ? "Ingresando..." : "Sign in"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative hidden w-0 flex-1 lg:block">
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                        className="absolute inset-0 size-full object-cover"
                    />
                </div>
            </div>
        </>
    )
}

export default Login2;