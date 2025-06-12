import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export const Calendario = () => {
    const [value, setValue] = useState([new Date(), new Date()]);
    const [usuario, setUsuario] = useState("");
    const [motivo, setMotivo] = useState("");
    const [vacaciones, setVacaciones] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false); // NUEVO
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchVacaciones = async () => {
            try {
                const res = await fetch('https://telemetria-backend.onrender.com/api/vacaciones', {
                    headers: token ? { "Authorization": `Bearer ${token}` } : {}
                });
                if (res.ok) {
                    const data = await res.json();
                    setVacaciones(Array.isArray(data) ? data : []);
                }
            } catch {
                setVacaciones([]);
            }
        };
        fetchVacaciones();
    }, [token]);

    const handleRegistrar = async (e) => {
        e.preventDefault();
        if (!token) return;
        const body = {
            usuario,
            desde: value[0],
            hasta: value[1],
            motivo
        };
        const url = editId
            ? `https://telemetria-backend.onrender.com/api/vacaciones/${editId}`
            : 'https://telemetria-backend.onrender.com/api/vacaciones';
        const method = editId ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            const nueva = await res.json();
            if (editId) {
                setVacaciones(vacaciones.map(v => v._id === editId ? nueva : v));
                setEditId(null);
            } else {
                setVacaciones([...vacaciones, nueva]);
            }
            setMotivo("");
            setUsuario("");
            setShowSuccess(true); // Mostrar modal
            setTimeout(() => setShowSuccess(false), 2000); // Ocultar después de 2 segundos
        }
    };

    const handleEliminar = async (id) => {
        if (!token) return;
        if (!window.confirm("¿Eliminar este registro de vacaciones?")) return;
        const res = await fetch(`https://telemetria-backend.onrender.com/api/vacaciones/${id}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            setVacaciones(vacaciones.filter(v => v._id !== id));
        }
    };

    const handleEditar = (vac) => {
        setValue([new Date(vac.desde), new Date(vac.hasta)]);
        setMotivo(vac.motivo || "");
        setUsuario(vac.usuario || "");
        setEditId(vac._id);
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <h2 className="text-2xl font-bold mb-4">Calendario de Vacaciones</h2>
            <div className="flex w-full max-w-5xl gap-8 items-start">
                {/* Columna izquierda: Calendario y formulario */}
                <div className="flex flex-col items-center w-full max-w-md">
                    <Calendar
                        onChange={setValue}
                        value={value}
                        selectRange={true}
                    />
                    <form onSubmit={handleRegistrar} className="mt-4 flex flex-col items-center gap-2 w-full">
                        <input
                            type="text"
                            placeholder="Nombre del usuario"
                            value={usuario}
                            onChange={e => setUsuario(e.target.value)}
                            className="border rounded px-2 py-1 w-full"
                            required
                        />
                        <div>
                            <span className="font-semibold">Desde:</span> {value[0]?.toLocaleDateString()} &nbsp;
                            <span className="font-semibold">Hasta:</span> {value[1]?.toLocaleDateString()}
                        </div>
                        <input
                            type="text"
                            placeholder="Motivo (opcional)"
                            value={motivo}
                            onChange={e => setMotivo(e.target.value)}
                            className="border rounded px-2 py-1 w-full"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                            disabled={!value[0] || !value[1] || !usuario}
                        >
                            {editId ? "Actualizar Vacaciones" : "Registrar Vacaciones"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                onClick={() => { setEditId(null); setMotivo(""); setUsuario(""); }}
                                className="bg-gray-400 text-white px-4 py-2 rounded w-full"
                            >
                                Cancelar edición
                            </button>
                        )}
                    </form>
                </div>
                {/* Columna derecha: Listado */}
                <div className="w-full max-w-md">
                    <h3 className="text-lg font-bold mb-2">Vacaciones Registradas</h3>
                    <ul>
                        {vacaciones.map((v) => (
                            <li key={v._id} className="border-b py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <span className="font-semibold">Usuario:</span> {v.usuario} <br />
                                    <span className="font-semibold">Desde:</span> {new Date(v.desde).toLocaleDateString()} &nbsp;
                                    <span className="font-semibold">Hasta:</span> {new Date(v.hasta).toLocaleDateString()}<br />
                                    {v.motivo && <span className="italic">Motivo: {v.motivo}</span>}
                                </div>
                                <div className="mt-2 md:mt-0 flex gap-2">
                                    <button
                                        onClick={() => handleEditar(v)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(v._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {showSuccess && (
                <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded shadow-lg">
                    ¡Registro de vacaciones guardado exitosamente!
                </div>
            )}
        </div>
    );
};

export default Calendario;