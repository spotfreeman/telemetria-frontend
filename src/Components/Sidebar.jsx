import { HomeIcon } from '@heroicons/react/20/solid';
import { CiStickyNote } from "react-icons/ci";
import { WiThermometer } from "react-icons/wi";
import { GrServerCluster } from "react-icons/gr";

import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();

    const links = [
        { to: "/", icon: <HomeIcon className="h-5 w-5" />, label: "Inicio" },
        { to: "/datos", icon: <WiThermometer className="h-5 w-5" />, label: "Rpi Historico" },
        { to: "/tempdata", icon: <WiThermometer className="h-5 w-5" />, label: "Rpi Resumen" },
        { to: "/server", icon: <GrServerCluster className="h-5 w-5" />, label: "IP Server" },
        { to: "/notas", icon: <CiStickyNote  className="h-5 w-5" />, label: "Notas" },

        // { to: "/settings", icon: <Cog6ToothIcon className="h-5 w-5" />, label: "Configuración" },
    ];

    return (
        <aside className="w-56 bg-gradient-to-b from-blue-900 to-gray-800 text-white min-h-screen flex flex-col py-6 px-2 shadow-lg">
            {/* Encabezado */}
            <div className="mb-8 flex items-center justify-center">
                <span className="text-xl font-bold tracking-wide text-blue-300">Telemetría</span>
            </div>
            {/* Navegación */}
            <nav className="flex flex-col gap-1">
                {links.map(link => (
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
            {/* Separador visual */}
            <div className="mt-auto border-t border-blue-900 pt-4 text-xs text-blue-200 text-center opacity-60">
                &copy; {new Date().getFullYear()} Proyecto Telemetría
            </div>
        </aside>
    );
}

export default Sidebar;
