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
import { ValorUF } from './ValorUF';

/**
 * Verifica si el token JWT es válido (no expirado).
 * @param {string} token - Token JWT almacenado en localStorage.
 * @returns {boolean} true si el token es válido, false si no.
 */
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
    // Hooks de React Router para navegación y ubicación actual
    const location = useLocation();
    const navigate = useNavigate();

    // Obtiene datos del usuario y token desde localStorage
    const token = localStorage.getItem("token");
    const tokenValido = isTokenValid(token);
    const usuario = localStorage.getItem("usuario");
    const nombre = localStorage.getItem("nombre");

    // Fecha actual formateada
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    // Lista de enlaces del sidebar (puedes modificar según tus necesidades)
    const links = [
        { to: "/", icon: <HomeIcon className="h-5 w-5" />, label: "Inicio" },
        { to: "/login/login2", icon: <UsersIcon className="h-5 w-5" />, label: "Login" },
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
        { to: "/mercado", icon: <UsersIcon className="h-5 w-5" />, label: "Mercado Público" },
    ];

    /**
     * Filtra los enlaces según si el usuario está autenticado (token válido).
     * - Si no hay token válido, solo muestra el login.
     * - Si hay token válido, oculta el login y muestra el resto.
     */
    const filteredLinks = links.filter(link => {
        if (link.to === "/login/login2" && tokenValido) return false;
        if (link.to === "/" && tokenValido) return false;
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
        if (link.to === "/mercado" && !tokenValido) return false;
        return true;
    });

    // Estado para controlar qué menús desplegables están abiertos
    const [openMenus, setOpenMenus] = useState({});

    /**
     * Alterna el estado abierto/cerrado de un menú desplegable.
     * @param {string} menu - Nombre del grupo de menú.
     */
    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    /**
     * Agrupa los enlaces en secciones desplegables.
     * Puedes agregar/quitar grupos y subenlaces según tus necesidades.
     */
    const groupedLinks = [
        {
            label: "Telemetría",
            icon: <ChartPieIcon className="h-5 w-5" />,
            children: [
                { to: "/datos", icon: <ChartPieIcon className="h-5 w-5" />, label: "Rpi Histórico" },
                { to: "/tempdata", icon: <ChartPieIcon className="h-5 w-5" />, label: "Rpi Resumen" },
                { to: "/esp32", icon: <UsersIcon className="h-5 w-5" />, label: "ESP32" },
            ]
        },
        {
            label: "Proyectos",
            icon: <FolderIcon className="h-5 w-5" />,
            children: [
                { to: "/proyectos", icon: <FolderIcon className="h-5 w-5" />, label: "Proyectos" },
                { to: "/mercado", icon: <UsersIcon className="h-5 w-5" />, label: "Mercado Público" },
                { to: "/calendario", icon: <CalendarIcon className="h-5 w-5" />, label: "Calendario" },
                { to: "/archivos", icon: <DocumentDuplicateIcon className="h-5 w-5" />, label: "Archivos" },
                { to: "/notas", icon: <FolderIcon className="h-5 w-5" />, label: "Notas" },
            ]
        },
        // Otros links sueltos
        {
            label: "Otros",
            children: [
                { to: "/bienvenida", icon: <HomeIcon className="h-5 w-5" />, label: "Bienvenida" },
                { to: "/server", icon: <FolderIcon className="h-5 w-5" />, label: "IP Server" },
                { to: "/roles", icon: <UsersIcon className="h-5 w-5" />, label: "Roles" },
            ]
        }
    ];

    // Función para filtrar los links según autenticación
    function filtrarLinksPorAuth(links, tokenValido) {
        return links
            .map(group => ({
                ...group,
                children: group.children.filter(link => {
                    // Aquí replica la lógica de filteredLinks:
                    if (link.to === "/login/login2" && tokenValido) return false;
                    if (link.to === "/" && tokenValido) return false;
                    if (
                        ["/proyectos", "/server", "/notas", "/calendario", "/archivos", "/tempdata", "/datos", "/bienvenida", "/roles", "/esp32", "/mercado"]
                            .includes(link.to) && !tokenValido
                    ) return false;
                    return true;
                })
            }))
            // Solo muestra grupos que tengan al menos un hijo visible
            .filter(group => group.children.length > 0);
    }

    const groupedLinksFiltrados = filtrarLinksPorAuth(groupedLinks, tokenValido);

    /**
     * Cierra la sesión del usuario, elimina el token y redirige al login.
     */
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("nombre");
        localStorage.removeItem("rol");
        navigate("/login/login2");
    };

    return (
        <aside className="w-56 bg-gradient-to-b from-blue-900 to-gray-800 text-white min-h-screen flex flex-col py-6 px-2 shadow-lg">
            {/* Información del usuario */}
            <div className="mb-8 flex flex-col items-center justify-center">
                <span className="text-xl font-bold tracking-wide text-blue-300">ROB-Data</span>
                {token && usuario && (
                    <div className="mt-4 flex flex-col items-center">
                        {/* Botón para editar información personal */}
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
            {/* Navegación principal con menús agrupados y desplegables */}
            <nav className="flex flex-col gap-1">
                {groupedLinksFiltrados.map((group, idx) => (
                    <div key={group.label}>
                        {/* Si el grupo tiene más de un hijo, muestra como menú desplegable */}
                        {group.children.length > 1 ? (
                            <>
                                <button
                                    className="flex items-center w-full px-3 py-2 rounded hover:bg-blue-700 font-semibold transition"
                                    onClick={() => toggleMenu(group.label)}
                                >
                                    {group.icon}
                                    <span className="ml-2 flex-1 text-left">{group.label}</span>
                                    <span>{openMenus[group.label] ? "▲" : "▼"}</span>
                                </button>
                                {openMenus[group.label] && (
                                    <div className="ml-6 flex flex-col">
                                        {group.children.map(link => (
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
                                    </div>
                                )}
                            </>
                        ) : (
                            // Si solo tiene un hijo, muestra como link normal
                            group.children.map(link => (
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
                            ))
                        )}
                    </div>
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
            {/* Footer */}
            <div className="mt-auto border-t border-blue-900 pt-4 text-xs text-blue-200 text-center opacity-60">
                &copy; {new Date().getFullYear()} ROB-Data
            </div>
        </aside>
    );
}

export default Sidebar;
