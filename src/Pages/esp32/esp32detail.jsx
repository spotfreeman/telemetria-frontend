import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Esp32Detail = () => {
    const { deviceId } = useParams();
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`https://telemetria-backend.onrender.com/api/esp32/${deviceId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener datos");
                return res.json();
            })
            .then(data => setDevice(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [deviceId]);

    if (loading) return <div className="text-center py-8 text-blue-700">Cargando...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;
    if (!device) return <div className="text-center py-8 text-gray-600">No se encontró el dispositivo.</div>;

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
                Detalle de <span className="text-blue-600">{device.deviceId}</span>
            </h2>
            <ul className="divide-y divide-blue-100">
                {device.datas.map((d, idx) => (
                    <li key={idx} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="text-gray-700">
                            <span className="font-semibold text-blue-700">Fecha:</span>{" "}
                            <span className="text-gray-900">{new Date(d.timestamp).toLocaleString("es-CL")}</span>
                        </div>
                        <div className="mt-2 md:mt-0 text-gray-700">
                            <span className="font-semibold text-green-700">Temp:</span>{" "}
                            <span className="text-gray-900">{d.temperature}°C</span>
                        </div>
                        <div className="mt-2 md:mt-0 text-gray-700">
                            <span className="font-semibold text-cyan-700">Humedad:</span>{" "}
                            <span className="text-gray-900">{d.humidity}%</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Esp32Detail;