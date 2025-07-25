import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export const Bienvenida = () => {
    const [totalProyectos, setTotalProyectos] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Si no hay token, no hace la petición
            setTotalProyectos(0);
            navigate('/login/login2'); // Redirige al login si no hay token
            return;
        }
        fetch('https://telemetria-backend.onrender.com/api/proyectos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login/login2');
                    throw new Error('No autorizado');
                }
                if (!res.ok) throw new Error('Error en la petición');
                return res.json();
            })

            .then(data => setTotalProyectos(Array.isArray(data) ? data.length : 0))
            .catch(() => setTotalProyectos(0));
    }, []);

    const stats = [
        { id: 1, name: 'Proyectos en BD', value: `+${totalProyectos}` },
        { id: 2, name: 'Gasto Proyectado', value: '$500M' },
        { id: 3, name: 'Gasto Ejecutado', value: '35%' },
        { id: 4, name: 'Usuarios activos', value: '+10' },
    ];

    // Funciones para redirigir según el rol
    const rol = localStorage.getItem("rol");
    const rolesText = {
        Administrador: "Bienvenido, Administrador",
        Usuario: "Bienvenido, Usuario"
    };

    return (
        <div className="relative bg-white">
            <img
                alt=""
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80"
                className="size-full w-full bg-gray-50 object-cover lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-1/2"
            />
            <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
                <div className="px-6 pt-16 pb-24 sm:pt-20 sm:pb-32 lg:col-start-2 lg:px-8 lg:pt-32">
                    <div className="mx-auto max-w-2xl lg:mr-0 lg:max-w-lg">
                        <h2 className="text-base/8 font-semibold text-indigo-600">Plataforma : ROB-Data</h2>
                        <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                            Welcome to Telemetría, your telemetry solution. {totalProyectos > 0 ? `Total Proyectos: ${totalProyectos}` : 'Cargando...'}
                        </p>
                        <p className="mt-6 text-lg/8 text-gray-600">
                            Plataforma para la gestión de telemetría de equipos, que permite a los usuarios monitorear y analizar datos en tiempo real, optimizando el rendimiento y la seguridad.
                        </p>
                        <p>{rolesText[rol]}</p>
                        <dl className="mt-16 grid max-w-xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 xl:mt-16">
                            {stats.map((stat) => (
                                <div key={stat.id} className="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                                    <dt className="text-sm/6 text-gray-600">{stat.name}</dt>
                                    <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bienvenida;