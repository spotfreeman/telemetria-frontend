import { useMemo } from 'react';

/**
 * Hook personalizado para manejar roles y permisos de usuario
 * @returns {Object} Objeto con funciones y propiedades relacionadas con roles
 */
export const useRoles = () => {
    // Obtener el rol del usuario desde localStorage
    const userRole = useMemo(() => {
        return localStorage.getItem('rol') || 'usuario';
    }, []);

    // Obtener información del usuario
    const userInfo = useMemo(() => {
        return {
            rol: userRole,
            nombre: localStorage.getItem('nombre') || 'Usuario',
            usuario: localStorage.getItem('usuario') || '',
            token: localStorage.getItem('token') || ''
        };
    }, [userRole]);

    // Verificar si el usuario es administrador
    const isAdmin = useMemo(() => {
        return userRole.toLowerCase() === 'admin' || userRole.toLowerCase() === 'administrador';
    }, [userRole]);

    // Verificar si el usuario es editor
    const isEditor = useMemo(() => {
        return userRole.toLowerCase() === 'editor' || isAdmin;
    }, [userRole, isAdmin]);

    // Verificar si el usuario es supervisor
    const isSupervisor = useMemo(() => {
        return userRole.toLowerCase() === 'supervisor' || isEditor;
    }, [userRole, isEditor]);

    // Verificar si el usuario puede crear proyectos
    const canCreateProjects = useMemo(() => {
        return isAdmin;
    }, [isAdmin]);

    // Verificar si el usuario puede editar proyectos
    const canEditProjects = useMemo(() => {
        return isEditor;
    }, [isEditor]);

    // Verificar si el usuario puede eliminar proyectos
    const canDeleteProjects = useMemo(() => {
        return isAdmin;
    }, [isAdmin]);

    // Verificar si el usuario puede ver todos los proyectos
    const canViewAllProjects = useMemo(() => {
        return isSupervisor;
    }, [isSupervisor]);

    // Obtener permisos específicos
    const permissions = useMemo(() => {
        return {
            createProjects: canCreateProjects,
            editProjects: canEditProjects,
            deleteProjects: canDeleteProjects,
            viewAllProjects: canViewAllProjects,
            manageUsers: isAdmin,
            manageSettings: isAdmin,
            viewReports: isSupervisor,
            exportData: isEditor
        };
    }, [canCreateProjects, canEditProjects, canDeleteProjects, canViewAllProjects, isAdmin, isSupervisor, isEditor]);

    // Función para verificar un permiso específico
    const hasPermission = (permission) => {
        return permissions[permission] || false;
    };

    // Función para verificar múltiples permisos (todos deben ser true)
    const hasAllPermissions = (permissionList) => {
        return permissionList.every(permission => hasPermission(permission));
    };

    // Función para verificar múltiples permisos (al menos uno debe ser true)
    const hasAnyPermission = (permissionList) => {
        return permissionList.some(permission => hasPermission(permission));
    };

    return {
        userRole,
        userInfo,
        isAdmin,
        isEditor,
        isSupervisor,
        canCreateProjects,
        canEditProjects,
        canDeleteProjects,
        canViewAllProjects,
        permissions,
        hasPermission,
        hasAllPermissions,
        hasAnyPermission
    };
};
