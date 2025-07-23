import React, { useState } from "react";

const API_KEY = "188425FD-75B8-44E0-9678-9DC2F09CFCD6";

export const Mercado = () => {
    const [licitaciones, setLicitaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputId, setInputId] = useState("");
    const [error, setError] = useState("");
    const [openIdx, setOpenIdx] = useState(null); // Para controlar el desplegable

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
                    <li key={licit.CodigoExterno || idx} className="mb-2 border rounded">
                        <button
                            className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded flex justify-between items-center"
                            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                        >
                            <span>
                                <strong>{licit.Nombre}</strong> - {licit.Estado}
                                <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold
                                    ${licit.Estado === "Adjudicada" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                    {licit.Estado}
                                </span>
                            </span>
                            <span>{openIdx === idx ? "▲" : "▼"}</span>
                        </button>
                        {openIdx === idx && (
                            <div className="px-4 py-2 bg-gray-50 border-t text-sm">
                                <div><strong>Código:</strong> {licit.CodigoExterno}</div>
                                <div><strong>Organismo:</strong> {licit.NombreOrganismo}</div>
                                <div><strong>Tipo:</strong> {licit.TipoLicitacion}</div>
                                <div><strong>Fecha Publicación:</strong> {licit.FechaPublicacion}</div>
                                <div><strong>Fecha Cierre:</strong> {licit.FechaCierre}</div>
                                <div><strong>Descripción:</strong> {licit.Descripcion}</div>

                                {/* Mostrar adjudicatarios si existen */}
                                {licit.Items && licit.Items.Listado && licit.Items.Listado.length > 0 && (
                                    <div className="mt-2">
                                        <strong>Adjudicatarios:</strong>
                                        <table className="min-w-full mt-2 text-xs border">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    <th className="px-2 py-1 border">Proveedor</th>
                                                    <th className="px-2 py-1 border">Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {licit.Items.Listado.map((item, i) => (
                                                    <tr key={i} className="border-b">
                                                        <td className="px-2 py-1 border">
                                                            {item.Adjudicacion && item.Adjudicacion.NombreProveedor
                                                                ? item.Adjudicacion.NombreProveedor
                                                                : <span className="italic text-gray-400">Sin adjudicación</span>}
                                                        </td>
                                                        <td className="px-2 py-1 border">
                                                            {item.Adjudicacion && item.Adjudicacion.MontoUnitario
                                                                ? item.Adjudicacion.MontoUnitario.toLocaleString('es-CL')
                                                                : "-"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Mercado;