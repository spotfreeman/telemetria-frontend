import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Importa los íconos de Heroicons
import { ServerIcon } from '@heroicons/react/16/solid';

import {
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
} from '@heroicons/react/24/outline'

// Importa el componente ValorUF
import { ValorUF } from './ValorUF'; // Asegúrate de que este componente esté correctamente importado


function isTokenValid(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // exp está en segundos
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const tokenValido = isTokenValid(token);
    const usuario = localStorage.getItem("usuario");
    const nombre = localStorage.getItem("nombre");

    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const links = [
        { to: "/", icon: <HomeIcon className="h-5 w-5" />, label: "Inicio" },

        { to: "/login/login2", icon: <UsersIcon className="h-5 w-5" />, label: "Login" },

        // { to: "/login", icon: <ServerIcon className="h-5 w-5" />, label: "Iniciar Sesión v1" },

        { to: "/bienvenida", icon: <HomeIcon className="h-5 w-5" />, label: "Bienvenida" },

        { to: "/proyectos", icon: <FolderIcon className="h-5 w-5" />, label: "Proyectos" },
        { to: "/datos", icon: <ChartPieIcon className="h-5 w-5" />, label: "Rpi Historico" },
        { to: "/tempdata", icon: <ChartPieIcon className="h-5 w-5" />, label: "Rpi Resumen" },
        { to: "/server", icon: <FolderIcon className="h-5 w-5" />, label: "IP Server" },
        { to: "/notas", icon: <FolderIcon className="h-5 w-5" />, label: "Notas" },
        { to: "/calendario", icon: <CalendarIcon className="h-5 w-5" />, label: "Calendario" },
        { to: "/archivos", icon: <DocumentDuplicateIcon className="h-5 w-5" />, label: "Archivos" },
        { to: "/roles", icon: <UsersIcon className="h-5 w-5" />, label: "Roles" },
        { to: "/esp32", icon: <UsersIcon className="h-5 w-5" />, label: "ESP32" },

    ];

    const filteredLinks = links.filter(link => {
        // Si no hay token válido, solo mostrar el login
        if (link.to === "/login/login2" && tokenValido) return false;
        if (link.to === "/" && tokenValido) return false;

        // Si hay token válido, mostrar todos los enlaces excepto el login
        if (link.to === "/proyectos" && !tokenValido) return false;
        if (link.to === "/server" && !tokenValido) return false;
        if (link.to === "/notas" && !tokenValido) return false;
        if (link.to === "/calendario" && !tokenValido) return false;
        if (link.to === "/archivos" && !tokenValido) return false;
        if (link.to === "/tempdata" && !tokenValido) return false;
        if (link.to === "/datos" && !tokenValido) return false;
        if (link.to === "/bienvenida" && !tokenValido) return false;
        if (link.to === "/roles" && !tokenValido) return false;
        if (link.to === "/esp32" && !tokenValido) return false;

        return true;
    });

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login/login2");
    };

    return (
        <aside className="w-56 bg-gradient-to-b from-blue-900 to-gray-800 text-white min-h-screen flex flex-col py-6 px-2 shadow-lg">
            <div className="mb-8 flex flex-col items-center justify-center">
                <span className="text-xl font-bold tracking-wide text-blue-300">ROB-Data</span>
                {token && usuario && (
                    <div className="mt-4 flex flex-col items-center">

                        <button
                            onClick={() => navigate("/usuarioconfig")}
                            className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-200 text-blue-800 font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition hover:scale-105"
                            title="Editar información personal"
                        >
                            {nombre && nombre.length > 0 ? nombre.charAt(0).toUpperCase() : "?"}
                        </button>

                        <span className="mt-2 text-blue-100 text-sm">{nombre}</span>
                        <span className="text-blue-200 text-xs">{fechaFormateada}</span>
                        <ValorUF />
                    </div>
                )}
            </div>
            <nav className="flex flex-col gap-1">
                {filteredLinks.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center gap-3 px-3 py-2 rounded transition 
                            ${location.pathname === link.to
                                ? "bg-blue-700 text-white font-semibold shadow"
                                : "hover:bg-blue-600 hover:text-blue-100"}
                        `}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>
            {/* Botón de cerrar sesión solo si hay token válido */}
            {tokenValido && (
                <button
                    onClick={handleLogout}
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full transition"
                >
                    Cerrar Sesión
                </button>
            )}
            <div className="mt-auto border-t border-blue-900 pt-4 text-xs text-blue-200 text-center opacity-60">
                &copy; {new Date().getFullYear()} ROB-Data
            </div>
        </aside>
    );
}

export default Sidebar;
