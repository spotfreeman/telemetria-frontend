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

    return (
        <div className="flex flex-col items-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Datos de Raspberry Pi </h2>
            <h3 className="text-xl mb-2 font-bold">IP Servidor 7 Days : {ultimaIpExterna}</h3>
            <h3 className="text-xl mb-2 font-bold">IP Servidor Unity : {ultimaIpExterna}</h3>
        </div>
    );
}