import React, { useEffect, useState } from 'react';

function DatosPage() {
    const [datos, setDatos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const datosPorPagina = 15;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error('No hay token de autenticación');
                    return;
                }

                const response = await fetch('https://telemetria-backend.onrender.com/api/temperaturas', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        console.error('Sesión expirada');
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        return;
                    }
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                // Ordenar por fecha_hora descendente (más nuevo primero)
                const ordenados = Array.isArray(data)
                    ? data.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))
                    : [];
                setDatos(ordenados);
            } catch (error) {
                console.error('Error fetching temperature data:', error);
            }
        };

        fetchData();
    }, []);

    // Calcular los datos a mostrar en la página actual
    const indiceUltimo = paginaActual * datosPorPagina;
    const indicePrimero = indiceUltimo - datosPorPagina;
    const datosPagina = datos.slice(indicePrimero, indiceUltimo);

    // Calcular el número total de páginas
    const totalPaginas = Math.ceil(datos.length / datosPorPagina);

    // Función para cambiar de página
    const cambiarPagina = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
    };

    return (
        <div className="flex flex-col items-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Datos desde MongoDB</h2>
            <table className="min-w-[300px] w-1/2 border border-gray-300 rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Fecha y Hora</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Temperatura</th>
                    </tr>
                </thead>
                <tbody>
                    {datosPagina.map((dato, idx) => (
                        <tr key={dato._id} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{dato.fecha_hora}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{dato.temperatura}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Controles de paginación */}
            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Anterior
                </button>
                <span>Página {paginaActual} de {totalPaginas}</span>
                <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default DatosPage;