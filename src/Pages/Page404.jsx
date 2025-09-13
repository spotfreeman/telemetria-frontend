import { Link } from "react-router-dom";
import { 
    HomeIcon, 
    ArrowLeftIcon, 
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export const Page404 = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto text-center">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                </div>

                <div className="relative">
                    {/* Icono principal */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
                                <ExclamationTriangleIcon className="w-16 h-16 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                <QuestionMarkCircleIcon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Número 404 */}
                    <div className="mb-6">
                        <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                            404
                        </h1>
                    </div>

                    {/* Título */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        ¡Oops! Página no encontrada
                    </h2>

                    {/* Descripción */}
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Lo sentimos, la página que estás buscando no existe o ha sido movida. 
                        Pero no te preocupes, podemos ayudarte a encontrar lo que necesitas.
                    </p>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link
                            to="/"
                            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            <HomeIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                            <span>Ir al Inicio</span>
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="group inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                            <span>Volver Atrás</span>
                        </button>
                    </div>

                    {/* Enlaces útiles */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-2xl mx-auto">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                            Enlaces útiles
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                to="/proyectos"
                                className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                                    <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-gray-900">Proyectos</h4>
                                    <p className="text-sm text-gray-600">Ver todos los proyectos</p>
                                </div>
                            </Link>

                            <Link
                                to="/tempdata"
                                className="group flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-200"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-gray-900">Telemetría</h4>
                                    <p className="text-sm text-gray-600">Datos en tiempo real</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Si crees que esto es un error, por favor contacta al administrador del sistema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Page404;
