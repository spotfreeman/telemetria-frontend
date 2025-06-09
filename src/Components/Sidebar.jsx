import { HomeIcon } from '@heroicons/react/20/solid';
import { ServerIcon } from '@heroicons/react/16/solid';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();
    const token = localStorage.getItem("token");

    const links = [
        { to: "/", icon: <HomeIcon className="h-5 w-5" />, label: "Inicio" },
        { to: "/login", icon: <ServerIcon className="h-5 w-5" />, label: "Iniciar Sesión" },
        { to: "/proyectos", icon: <ServerIcon className="h-5 w-5" />, label: "Proyectos" },
        { to: "/datos", icon: <ServerIcon className="h-5 w-5" />, label: "Rpi Historico" },
        { to: "/tempdata", icon: <ServerIcon className="h-5 w-5" />, label: "Rpi Resumen" },
        { to: "/server", icon: <ServerIcon className="h-5 w-5" />, label: "IP Server" },
        { to: "/notas", icon: <ServerIcon className="h-5 w-5" />, label: "Notas" },
    ];

    // Filtra los enlaces según el estado del token
    const filteredLinks = links.filter(link => {
        if (link.to === "/login" && token) return false; // Oculta login si hay token
        if (link.to === "/proyectos" && !token) return false; // Oculta proyectos si NO hay token
        return true;
    });

    return (
        <aside className="w-56 bg-gradient-to-b from-blue-900 to-gray-800 text-white min-h-screen flex flex-col py-6 px-2 shadow-lg">
            <div className="mb-8 flex items-center justify-center">
                <span className="text-xl font-bold tracking-wide text-blue-300">Telemetría</span>
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
            <div className="mt-auto border-t border-blue-900 pt-4 text-xs text-blue-200 text-center opacity-60">
                &copy; {new Date().getFullYear()} Proyecto Telemetría
            </div>
        </aside>
    );
}

export default Sidebar;
