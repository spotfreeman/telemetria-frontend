import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Esp32List = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No hay token de autenticación.");
            setLoading(false);
            return;
        }
        fetch("https://telemetria-backend.onrender.com/api/esp32", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener datos");
                return res.json();
            })
            .then(data => setDevices(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Lista de deviceId ESP32</h2>
            <ul>
                {devices.map(device => (
                    <li key={device.deviceId}>
                        <Link to={`/esp32/${device.deviceId}`}>
                            {device.deviceId}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Esp32List;