import React, { useEffect, useState } from "react";

export const Server = () => {
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/rpis')
            .then(res => res.json())
            .then(data => {
                // Ordena los datos por fecha_hora descendente (más nuevo primero)
                const datosOrdenados = [...data].sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
                setDatos(datosOrdenados);
            });
    }, []);

    return (
        <div className="flex flex-col items-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Datos de Raspberry Pi</h2>
            <table className="min-w-[300px] w-1/2 border border-gray-300 rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        <th className="px-4 py-2 border-b border-gray-300 text-center">ID</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Fecha</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">IP Interna</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">IP Externa</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Descripcion</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((dato, idx) => (
                        <tr key={dato._id || idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{idx + 1}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{dato.fecha_hora}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{dato.ip_interna}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{dato.ip_externa} </td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{dato.descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}