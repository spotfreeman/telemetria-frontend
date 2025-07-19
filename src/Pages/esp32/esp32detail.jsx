import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export const Esp32Detail = () => {
    const { deviceId } = useParams();
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDay, setSelectedDay] = useState(""); // Día seleccionado

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
            .then(data => {
                setDevice(data);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [deviceId]);

    if (loading) return <div className="text-center py-8 text-blue-700">Cargando...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;
    if (!device || (Array.isArray(device) && device.length === 0)) {
        return <div className="text-center py-8 text-gray-600">No se encontró el dispositivo.</div>;
    }

    const deviceObj = Array.isArray(device) ? device[0] : device;
    const datas = Array.isArray(deviceObj?.datas) ? deviceObj.datas : [];

    // Agrupar datos por día
    const datosPorDia = {};
    datas.forEach(d => {
        const fecha = new Date(d.timestamp).toLocaleDateString("es-CL");
        if (!datosPorDia[fecha]) {
            datosPorDia[fecha] = [];
        }
        datosPorDia[fecha].push(d);
    });

    const diasDisponibles = Object.keys(datosPorDia);

    // Filtrar datos por día seleccionado
    const datosFiltrados = selectedDay ? datosPorDia[selectedDay] : datas;

    const labels = datosFiltrados.map(d => new Date(d.timestamp).toLocaleTimeString("es-CL"));
    const tempData = datosFiltrados.map(d => d.temperature);
    const humData = datosFiltrados.map(d => d.humidity);

    const tempChartData = {
        labels,
        datasets: [
            {
                label: "Temperatura (°C)",
                data: tempData,
                fill: false,
                borderColor: "rgb(37, 99, 235)",
                backgroundColor: "rgba(37, 99, 235, 0.2)",
                tension: 0.2,
                pointRadius: 2,
            },
        ],
    };

    const humChartData = {
        labels,
        datasets: [
            {
                label: "Humedad (%)",
                data: humData,
                fill: false,
                borderColor: "rgb(6, 182, 212)",
                backgroundColor: "rgba(6, 182, 212, 0.2)",
                tension: 0.2,
                pointRadius: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, position: "top" },
            title: { display: false },
        },
        scales: {
            x: { ticks: { maxTicksLimit: 8 } },
        },
    };

    return (
        <div className="w-full container mt-10 bg-white rounded-lg shadow-lg p-8 px-4">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
                Detalle de <span className="text-blue-600">{deviceObj.deviceId}</span>
            </h2>
            <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
                <label className="font-semibold text-blue-700">Selecciona un día:</label>
                <select
                    className="border rounded px-2 py-1"
                    value={selectedDay}
                    onChange={e => setSelectedDay(e.target.value)}
                >
                    <option value="">Todos</option>
                    {diasDisponibles.map(dia => (
                        <option key={dia} value={dia}>{dia}</option>
                    ))}
                </select>
            </div>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4 shadow">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2 text-center">Temperatura</h3>
                    <Line data={tempChartData} options={chartOptions} />
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 shadow">
                    <h3 className="text-lg font-semibold text-cyan-700 mb-2 text-center">Humedad</h3>
                    <Line data={humChartData} options={chartOptions} />
                </div>
            </div>
            <ul className="divide-y divide-blue-100">
                {datosFiltrados.map((d, idx) => (
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