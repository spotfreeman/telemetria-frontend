import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Esp32Detail = () => {
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

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!device) return <div>No se encontró el dispositivo.</div>;

    return (
        <div>
            <h2>Detalle de {device.deviceId}</h2>
            <ul>
                {device.datas.map((d, idx) => (
                    <li key={idx}>
                        <strong>Fecha:</strong> {new Date(d.timestamp).toLocaleString("es-CL")}
                        {" | "}
                        <strong>Temp:</strong> {d.temperature}°C
                        {" | "}
                        <strong>Humedad:</strong> {d.humidity}%
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Esp32Detail;