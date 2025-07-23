import React, { useState } from "react";

const API_KEY = "F8537A18-6766-4DEF-9E59-426B4FEE2844";

export const Mercado = () => {
    const [licitaciones, setLicitaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputId, setInputId] = useState("");
    const [error, setError] = useState("");

    const buscarLicitacion = async () => {
        setError("");
        setLicitaciones([]);
        if (!inputId.trim()) {
            setError("Debes ingresar un ID de licitación.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(
                `https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo=${inputId.trim()}&ticket=${API_KEY}`
            );
            const data = await res.json();
            if (data && data.Listado && data.Listado.length > 0) {
                setLicitaciones(data.Listado);
            } else {
                setError("No se encontró información para ese ID.");
            }
        } catch (e) {
            setError("Error al consultar la API.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto mt-8 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Buscar Licitación Mercado Público</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    className="border rounded px-3 py-2 flex-1"
                    placeholder="ID de licitación (ej: 1180703-5-LR22)"
                    value={inputId}
                    onChange={e => setInputId(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") buscarLicitacion(); }}
                />
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={buscarLicitacion}
                    disabled={loading}
                >
                    Buscar
                </button>
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {loading && <p>Cargando...</p>}
            <ul>
                {licitaciones.map((licit, idx) => (
                    <li key={licit.CodigoExterno || idx} className="mb-2">
                        <strong>{licit.Nombre}</strong> - {licit.Estado}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Mercado;