import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../Contexts/ThemeContext';

// Importa los íconos de Heroicons
import {
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    BellIcon,
    SunIcon,
    MoonIcon,
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
    const rol = localStorage.getItem("rol");

    // Fecha actual formateada
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    // Estado para controlar qué menús desplegables están abiertos
    const [openMenus, setOpenMenus] = useState({});
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Hook para el modo oscuro
    const { isDarkMode, toggleTheme } = useTheme();

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
        // Grupo solo para Login (si no hay sesión)
        {
            label: "Acceso",
            icon: <UserCircleIcon className="h-5 w-5" />,
            children: [
                { to: "/login", icon: <UserCircleIcon className="h-5 w-5" />, label: "Iniciar Sesión", color: "from-blue-500 to-cyan-500" }
            ]
        },
        {
            label: "Dashboard",
            icon: <ChartPieIcon className="h-5 w-5" />,
            color: "from-blue-500 to-indigo-500",
            children: [
                { to: "/bienvenida", icon: <HomeIcon className="h-5 w-5" />, label: "Bienvenida", color: "from-blue-500 to-indigo-500" },
                { to: "/dashboard", icon: <ChartPieIcon className="h-5 w-5" />, label: "Dashboard", color: "from-blue-500 to-indigo-500" },
            ]
        },
        {
            label: "Telemetría",
            icon: <ChartPieIcon className="h-5 w-5" />,
            color: "from-emerald-500 to-teal-500",
            children: [
                { to: "/tempdata", icon: <ChartPieIcon className="h-5 w-5" />, label: "Rpi Resumen", color: "from-emerald-500 to-teal-500" },
                { to: "/esp32", icon: <UsersIcon className="h-5 w-5" />, label: "ESP32", color: "from-emerald-500 to-teal-500" },
            ]
        },
        {
            label: "Proyectos",
            icon: <FolderIcon className="h-5 w-5" />,
            color: "from-purple-500 to-pink-500",
            children: [
                { to: "/proyectos", icon: <FolderIcon className="h-5 w-5" />, label: "Proyectos", color: "from-purple-500 to-pink-500" },
                { to: "/mercado", icon: <UsersIcon className="h-5 w-5" />, label: "Mercado Público", color: "from-purple-500 to-pink-500" },
                { to: "/calendario", icon: <CalendarIcon className="h-5 w-5" />, label: "Calendario", color: "from-purple-500 to-pink-500" },
                { to: "/archivos", icon: <DocumentDuplicateIcon className="h-5 w-5" />, label: "Archivos", color: "from-purple-500 to-pink-500" },
                { to: "/notas", icon: <FolderIcon className="h-5 w-5" />, label: "Notas", color: "from-purple-500 to-pink-500" },
            ]
        },
        // Otros links sueltos
        {
            label: "Otros",
            icon: <Cog6ToothIcon className="h-5 w-5" />,
            color: "from-orange-500 to-red-500",
            children: [
                { to: "/server", icon: <FolderIcon className="h-5 w-5" />, label: "IP Server", color: "from-orange-500 to-red-500" },
                { to: "/test-roles", icon: <ShieldExclamationIcon className="h-5 w-5" />, label: "Test Roles", color: "from-orange-500 to-red-500" },
            ]
        }
    ];

    // Función para filtrar los links según autenticación
    function filtrarLinksPorAuth(links, tokenValido) {
        return links
            .map(group => ({
                ...group,
                children: group.children.filter(link => {
                    // Solo oculta el login si ya hay sesión
                    if (link.to === "/login" && tokenValido) return false;
                    // El resto igual que antes
                    if (link.to === "/" && tokenValido) return false;
                    if (
                        ["/proyectos", "/server", "/notas", "/calendario", "/archivos", "/tempdata", "/bienvenida", "/esp32", "/mercado", "/dashboard"]
                            .includes(link.to) && !tokenValido
                    ) return false;
                    return true;
                })
            }))
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
        navigate("/login");
    };

    return (
        <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen flex flex-col transition-all duration-300 ease-in-out shadow-2xl border-r border-white/10`}>
            {/* Header con logo y controles */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <ChartPieIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                ROB-Data
                            </span>
                        </div>
                    )}
                    <div className="flex items-center space-x-2">
                        {/* Toggle dark mode */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                            title="Cambiar tema"
                        >
                            {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
                        </button>
                        {/* Toggle collapse */}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                            title={isCollapsed ? "Expandir" : "Contraer"}
                        >
                            <ChevronRightIcon className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Información del usuario */}
            {tokenValido && usuario && (
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => navigate("/usuarioconfig")}
                            className="relative group"
                            title="Editar perfil"
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-200">
                                {nombre && nombre.length > 0 ? nombre.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                        </button>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{nombre}</p>
                                <p className="text-xs text-gray-400 truncate">{rol || 'Usuario'}</p>
                                <p className="text-xs text-gray-500">{fechaFormateada}</p>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && <ValorUF />}
                </div>
            )}

            {/* Navegación principal */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {groupedLinksFiltrados.map((group, idx) => (
                    <div key={group.label} className="space-y-1">
                        {/* Si el grupo tiene más de un hijo, muestra como menú desplegable */}
                        {group.children.length > 1 ? (
                            <>
                                <button
                                    className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${openMenus[group.label]
                                        ? 'bg-white/20 shadow-lg'
                                        : 'hover:bg-white/10'
                                        }`}
                                    onClick={() => toggleMenu(group.label)}
                                >
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${group.color} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200`}>
                                        {group.icon}
                                    </div>
                                    {!isCollapsed && (
                                        <>
                                            <span className="flex-1 text-left font-medium">{group.label}</span>
                                            {openMenus[group.label] ? (
                                                <ChevronDownIcon className="w-4 h-4 transition-transform duration-200" />
                                            ) : (
                                                <ChevronRightIcon className="w-4 h-4 transition-transform duration-200" />
                                            )}
                                        </>
                                    )}
                                </button>
                                {openMenus[group.label] && !isCollapsed && (
                                    <div className="ml-4 space-y-1 border-l-2 border-white/20 pl-4">
                                        {group.children.map(link => (
                                            <Link
                                                key={link.to}
                                                to={link.to}
                                                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${location.pathname === link.to
                                                    ? 'bg-white/20 shadow-lg transform scale-[1.02]'
                                                    : 'hover:bg-white/10 hover:transform hover:scale-[1.01]'
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${link.color} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200`}>
                                                    {link.icon}
                                                </div>
                                                <span className="font-medium">{link.label}</span>
                                                {location.pathname === link.to && (
                                                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                                                )}
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
                                    className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${location.pathname === link.to
                                        ? 'bg-white/20 shadow-lg transform scale-[1.02]'
                                        : 'hover:bg-white/10 hover:transform hover:scale-[1.01]'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${link.color} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200`}>
                                        {link.icon}
                                    </div>
                                    {!isCollapsed && (
                                        <>
                                            <span className="font-medium">{link.label}</span>
                                            {location.pathname === link.to && (
                                                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </>
                                    )}
                                </Link>
                            ))
                        )}
                    </div>
                ))}
            </nav>

            {/* Botón de cerrar sesión */}
            {tokenValido && (
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                        {!isCollapsed && "Cerrar Sesión"}
                    </button>
                </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                {!isCollapsed && (
                    <div className="text-center">
                        <p className="text-xs text-gray-400">
                            &copy; {new Date().getFullYear()} ROB-Data
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Sistema de Telemetría
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
