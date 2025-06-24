import React, { useEffect, useState } from "react";

import daysImg from "./Img/days.jpg"
import unityImg from "./Img/unitylogo.png";

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
            ip: ultimaIpExterna,
            image: daysImg,
            bio: 'Servidor dedicado para el juego 7 Days to Die, optimizado para ofrecer la mejor experiencia de juego.',
            url: '#',
        },
        {
            name: 'Servidor Unity',
            ip: ultimaIpExterna,
            image: unityImg,
            bio: 'Servidor dedicado para aplicaciones Unity, ideal para proyectos de desarrollo y pruebas.',
            url: ultimaIpExterna !== "No disponible" ? `http://${ultimaIpExterna}:3000` : "#",
        }
    ]

    return (
        <div className="flex flex-col items-center">

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
                                {/*  <p className="mt-4 text-base/7 text-gray-600">{servidor.url}</p> */}
                                <a
                                    href={servidor.url}
                                    className="mt-6 inline-block rounded-md bg-pretty px-3.5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-pretty/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pretty"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Acceder
                                </a>

                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}