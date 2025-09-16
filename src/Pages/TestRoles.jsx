import React, { useState } from 'react';
import { useRoles } from '../hooks/useRoles';
import { motion } from 'framer-motion';

export const TestRoles = () => {
    const {
        userRole,
        userInfo,
        isAdmin,
        isEditor,
        isSupervisor,
        canCreateProjects,
        canEditProjects,
        canDeleteProjects,
        permissions
    } = useRoles();

    const [testRole, setTestRole] = useState(userRole);
    const [isChangingRole, setIsChangingRole] = useState(false);

    const handleRoleChange = async (newRole) => {
        if (isChangingRole) return; // Evitar múltiples clics
        
        setIsChangingRole(true);
        
        try {
            // Actualizar el rol en localStorage
            localStorage.setItem('rol', newRole);
            setTestRole(newRole);
            
            // Mostrar mensaje de confirmación
            console.log(`Rol cambiado a: ${newRole}`);
            
            // Pequeño delay para que el usuario vea el cambio
            setTimeout(() => {
                // Recargar la página para aplicar el nuevo rol en toda la aplicación
                window.location.reload();
            }, 500);
            
        } catch (error) {
            console.error('Error al cambiar rol:', error);
            setIsChangingRole(false);
        }
    };

    const roles = [
        { value: 'usuario', label: 'Usuario', color: 'blue' },
        { value: 'editor', label: 'Editor', color: 'green' },
        { value: 'supervisor', label: 'Supervisor', color: 'yellow' },
        { value: 'admin', label: 'Administrador', color: 'purple' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Sistema de Roles y Permisos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                        Prueba el sistema de control de roles y permisos. Cambia tu rol para ver cómo afecta las funcionalidades disponibles.
                    </p>
                </div>

                {/* Selector de Rol */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cambiar Rol de Usuario</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {roles.map((role) => (
                            <button
                                key={role.value}
                                onClick={() => handleRoleChange(role.value)}
                                disabled={isChangingRole}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                    isChangingRole 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'cursor-pointer'
                                } ${testRole === role.value
                                        ? `border-${role.color}-500 bg-${role.color}-50 dark:bg-${role.color}-900/20`
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full bg-${role.color}-500 mx-auto mb-2 flex items-center justify-center`}>
                                    {isChangingRole && testRole === role.value ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : null}
                                </div>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                    {isChangingRole && testRole === role.value ? 'Cambiando...' : role.label}
                                </p>
                            </button>
                        ))}
                    </div>
                    
                    {isChangingRole && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                                🔄 Cambiando rol... La página se recargará automáticamente.
                            </p>
                        </div>
                    )}
                </div>

                {/* Información del Usuario Actual */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Información del Usuario</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Datos del Usuario</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">{userInfo.nombre}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Usuario:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">{userInfo.usuario}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Rol Actual:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isAdmin ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                            isEditor ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                isSupervisor ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        }`}>
                                        {userRole.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Estado de Permisos</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Es Admin:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isAdmin ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                        {isAdmin ? 'SÍ' : 'NO'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Es Editor:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isEditor ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                        {isEditor ? 'SÍ' : 'NO'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Es Supervisor:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isSupervisor ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                        {isSupervisor ? 'SÍ' : 'NO'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Permisos Detallados */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Permisos Detallados</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(permissions).map(([permission, hasPermission]) => (
                            <motion.div
                                key={permission}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${hasPermission
                                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${hasPermission
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}>
                                        {hasPermission ? 'PERMITIDO' : 'DENEGADO'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Acciones de Prueba */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Acciones de Prueba</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Crear Proyecto */}
                        <div className={`p-4 rounded-lg border-2 ${canCreateProjects
                                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-700 dark:text-gray-300">Crear Proyecto</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${canCreateProjects
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                    {canCreateProjects ? 'PERMITIDO' : 'DENEGADO'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {canCreateProjects
                                    ? 'Puedes crear nuevos proyectos'
                                    : 'Solo los administradores pueden crear proyectos'
                                }
                            </p>
                        </div>

                        {/* Editar Proyecto */}
                        <div className={`p-4 rounded-lg border-2 ${canEditProjects
                                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-700 dark:text-gray-300">Editar Proyecto</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${canEditProjects
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                    {canEditProjects ? 'PERMITIDO' : 'DENEGADO'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {canEditProjects
                                    ? 'Puedes editar proyectos existentes'
                                    : 'Solo editores y administradores pueden editar'
                                }
                            </p>
                        </div>

                        {/* Eliminar Proyecto */}
                        <div className={`p-4 rounded-lg border-2 ${canDeleteProjects
                                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-700 dark:text-gray-300">Eliminar Proyecto</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${canDeleteProjects
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                    {canDeleteProjects ? 'PERMITIDO' : 'DENEGADO'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {canDeleteProjects
                                    ? 'Puedes eliminar proyectos'
                                    : 'Solo los administradores pueden eliminar'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Instrucciones */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">Instrucciones de Prueba</h3>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Cambia tu rol usando los botones de arriba</li>
                        <li>• Ve a la página de "Proyectos" para ver cómo cambia la interfaz</li>
                        <li>• Solo los usuarios con rol "Admin" podrán ver el botón "Crear Proyecto"</li>
                        <li>• Los usuarios sin permisos verán un mensaje "Solo Administradores"</li>
                        <li>• El indicador de rol se actualiza automáticamente</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
