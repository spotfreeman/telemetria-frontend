import React, { useEffect, useState } from "react";

export const Esp32List = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("https://telemetria-backend.onrender.com/api/esp32", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setDevices(data));
    }, []);

    return (
        <div>
            <h2>Lista de deviceId ESP32</h2>
            <ul>
                {devices.map(device => (
                    <li key={device.deviceId}>{device.deviceId}</li>
                ))}
            </ul>
        </div>
    );
};

export default Esp32List;