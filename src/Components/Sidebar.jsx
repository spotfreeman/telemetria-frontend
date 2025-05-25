import { Cog6ToothIcon, HomeIcon, MegaphoneIcon, Square2StackIcon, TicketIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';




function Sidebar() {
    return (
        <aside className="w-56 bg-gray-800 text-white min-h-screen flex flex-col py-6 px-2">
            <nav className="flex flex-col gap-2">
                <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700">
                    <HomeIcon className="h-5 w-5" />
                    <span>Inicio</span>
                </Link>
                <Link to="/datos" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700">
                    <Square2StackIcon className="h-5 w-5" />
                    <span>Datos Rpi</span>
                </Link>
                <Link to="/tempdata" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700">
                    <TicketIcon className="h-5 w-5" />
                    <span>TempData Rpi</span>
                </Link>
                <Link to="/broadcasts" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700">
                    <MegaphoneIcon className="h-5 w-5" />
                    <span>Broadcasts</span>
                </Link>
                <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700">
                    <Cog6ToothIcon className="h-5 w-5" />
                    <span>Configuración</span>
                </Link>
            </nav>
        </aside>
    );
}

export default Sidebar;