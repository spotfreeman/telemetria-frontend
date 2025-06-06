import React, { useEffect, useState } from "react";

const Lista = () => {
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/proyectos')
            .then(res => res.json())
            .then(setProyectos);
    }, []);

    const handleCrearProyecto = () => {
        // Aquí puedes redirigir a un formulario o abrir un modal para crear proyecto
        alert("Funcionalidad para crear proyecto aún no implementada.");
    };

    return (
        <div className="flex flex-col items-center mt-8 w-full">
            <div className="w-full max-w-3xl flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Lista de Proyectos</h2>
                <button
                    className="bg-blue-700 text-white px-4 py-2 rounded shadow"
                    onClick={handleCrearProyecto}
                >
                    Crear Proyecto
                </button>
            </div>
            <table className="min-w-[300px] w-full max-w-3xl border border-gray-300 rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Código</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Nombre</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {proyectos.map((proyecto, idx) => (
                        <tr key={proyecto._id || idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{proyecto.codigo}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{proyecto.nombre}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{proyecto.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Lista;