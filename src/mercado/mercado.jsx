import React, { useEffect, useState } from "react";

const API_KEY = "F8537A18-6766-4DEF-9E59-426B4FEE2844"; // Reemplaza por tu API Key real

const idsLicitaciones = [
    "1180703-5-LR22",
];

export const Mercado = () => {
    const [licitaciones, setLicitaciones] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLicitaciones = async () => {
            setLoading(true);
            const resultados = [];
            for (const id of idsLicitaciones) {
                try {
                    const res = await fetch(
                        `https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo=${id}&ticket=${API_KEY}`
                    );
                    const data = await res.json();
                    if (data && data.Listado && data.Listado.length > 0) {
                        resultados.push(data.Listado[0]);
                    }
                } catch (e) {
                    // Manejo de error simple
                }
            }
            setLicitaciones(resultados);
            setLoading(false);
        };
        fetchLicitaciones();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Licitaciones Mercado Público</h2>
            {loading && <p>Cargando...</p>}
            <ul>
                {licitaciones.map((licit, idx) => (
                    <li key={licit.CodigoExterno || idx}>
                        <strong>{licit.Nombre}</strong> - {licit.Estado}
                    </li>
                ))}
            </ul>
        </div>
    );
};