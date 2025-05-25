import React, { useEffect, useState } from "react";

export const TempData = () => {
    const [datos, setDatos] = useState([]);
    const [pagina, setPagina] = useState(1);
    const porPagina = 20;

    useEffect(() => {
        fetch('https://telemetria-backend.onrender.com/api/temperaturas')
            .then(res => res.json())
            .then(setDatos);
    }, []);

    const totalPaginas = Math.ceil(datos.length / porPagina);
    const datosPagina = datos.slice((pagina - 1) * porPagina, pagina * porPagina);

    return (
        <div className="flex flex-col items-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Tabla de Datos de Temperatura</h2>
            <table className="min-w-[300px] w-full max-w-3xl border border-gray-300 rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Fecha y Hora</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Temperatura</th>
                    </tr>
                </thead>
                <tbody>
                    {datosPagina.map((dato, idx) => (
                        <tr key={dato._id || idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{dato.fecha_hora}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{dato.temperatura}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Paginación */}
            <div className="flex gap-2 mt-4">
                <button
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    onClick={() => setPagina(pagina - 1)}
                    disabled={pagina === 1}
                >
                    Anterior
                </button>
                <span className="px-3 py-1">{pagina} / {totalPaginas}</span>
                <button
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    onClick={() => setPagina(pagina + 1)}
                    disabled={pagina === totalPaginas}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
