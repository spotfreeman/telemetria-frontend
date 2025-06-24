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

    const ultimaIpExterna = datos.length > 0 ? datos[0].ip_externa : "No disponible";

    const servidores = [
        {
            name: 'Servidor 7 Days',
            ip: '255.255.255.255',
            image: 'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
            bio: 'Servidor dedicado para el juego 7 Days to Die, optimizado para ofrecer la mejor experiencia de juego.',
            url: '#',
        },
        {
            name: 'Servidor Unity',
            ip: '255.255.255.255',
            image: 'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
            bio: 'Servidor dedicado para aplicaciones Unity, ideal para proyectos de desarrollo y pruebas.',
            url: '#',
        }


    ]

    return (
        <div className="flex flex-col items-center mt-8">

            <div className="w-full bg-gray-200 py-3 px-2 flex items-center justify-between shadow mb-8">
                {/* Título a la izquierda */}
                <h1 className="text-black text-xl font-bold flex-1">Notas</h1>

                {/* Botón Agregar Nota al centro */}
                <div className="flex-1 flex justify-center">
                    <h3>centro</h3>
                </div>
                {/* Botón Exportar a Excel a la derecha */}
                <div className="flex-1 flex justify-end">
                    <h3>derecha</h3>
                </div>
            </div>

            <div>

                <h2 className="text-2xl font-bold mb-4">Datos de Raspberry Pi </h2>
                <h3 className="text-xl mb-2 font-bold">IP Servidor 7 Days : {ultimaIpExterna}</h3>
                <h3 className="text-xl mb-2 font-bold">IP Servidor Unity : {ultimaIpExterna}</h3>
            </div>

            {/* Lista de Servidores */}
            <div className="bg-white py-24 md:py-32 lg:py-40">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-20 px-6 lg:px-8 xl:grid-cols-3">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Servidores</h2>
                        <p className="mt-6 text-lg/8 text-gray-600">
                            Servidores disponibles para juegos y aplicaciones, optimizados para ofrecer la mejor experiencia de usuario.
                        </p>
                    </div>
                    <ul
                        role="list"
                        className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-8 xl:col-span-2"
                    >
                        {servidores.map((servidor) => (
                            <li key={servidor.name}>
                                <img alt="" src={servidor.image} className="aspect-[3/2] w-full rounded-2xl object-cover" />
                                <h3 className="mt-6 text-lg/8 font-semibold text-gray-900">{servidor.name}</h3>
                                <p className="text-base/7 text-gray-600">{servidor.ip}</p>
                                <p className="mt-4 text-base/7 text-gray-600">{servidor.bio}</p>
                                <p className="mt-4 text-base/7 text-gray-600">{servidor.url}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}