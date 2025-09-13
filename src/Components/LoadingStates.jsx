import React from 'react';
import { motion } from 'framer-motion';

// Componente de Loading Principal
export const MainLoading = ({ message = "Cargando..." }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
                <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <motion.div
                        className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </motion.div>
                <motion.h2
                    className="text-xl font-semibold text-gray-700 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {message}
                </motion.h2>
                <motion.p
                    className="text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Por favor espera un momento...
                </motion.p>
            </div>
        </div>
    );
};

// Componente de Loading para Cards
export const CardLoading = ({ count = 3 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <motion.div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="h-6 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Componente de Loading para Tablas
export const TableLoading = ({ rows = 5 }) => {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-6 w-1/3"></div>
                <div className="space-y-4">
                    {Array.from({ length: rows }).map((_, index) => (
                        <div key={index} className="flex space-x-4">
                            <div className="h-4 bg-gray-300 rounded flex-1"></div>
                            <div className="h-4 bg-gray-300 rounded flex-1"></div>
                            <div className="h-4 bg-gray-300 rounded flex-1"></div>
                            <div className="h-4 bg-gray-300 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Componente de Loading para Botones
export const ButtonLoading = ({ children, loading, ...props }) => {
    return (
        <motion.button
            {...props}
            disabled={loading}
            className={`${props.className} ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    Procesando...
                </div>
            ) : (
                children
            )}
        </motion.button>
    );
};

// Componente de Loading para Formularios
export const FormLoading = () => {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                </div>
                <div className="h-12 bg-gray-300 rounded mt-6"></div>
            </div>
        </div>
    );
};

// Componente de Loading para Gráficos
export const ChartLoading = () => {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-6 w-1/3"></div>
                <div className="h-80 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
};

// Componente de Loading para Listas
export const ListLoading = ({ items = 5 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: items }).map((_, index) => (
                <motion.div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="animate-pulse">
                        <div className="flex items-center justify-between mb-2">
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                        </div>
                        <div className="h-3 bg-gray-300 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Componente de Loading para Modales
export const ModalLoading = () => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
            >
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded mb-6 w-1/2"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <div className="h-12 bg-gray-300 rounded flex-1"></div>
                        <div className="h-12 bg-gray-300 rounded w-24"></div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Componente de Loading para Skeleton
export const SkeletonLoading = ({ width = "w-full", height = "h-4", className = "" }) => {
    return (
        <motion.div
            className={`bg-gray-300 rounded ${width} ${height} ${className}`}
            animate={{
                opacity: [0.5, 1, 0.5],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
};

export default {
    MainLoading,
    CardLoading,
    TableLoading,
    ButtonLoading,
    FormLoading,
    ChartLoading,
    ListLoading,
    ModalLoading,
    SkeletonLoading
};
