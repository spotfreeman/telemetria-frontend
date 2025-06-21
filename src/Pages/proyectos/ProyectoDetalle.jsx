import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";
import { HiOutlineAdjustments } from "react-icons/hi";
import { ArrowLeftIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import FechasProyecto from "./FechasProyecto";

export const ProyectoDetalle = () => {
    const { id } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editando, setEditando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [form, setForm] = useState({ codigo: "", nombre: "", estado: "", descripcion: "" });

    // Georreferencia
    const [geoForm, setGeoForm] = useState({ latitud: "", longitud: "" });
    const [showGeoModal, setShowGeoModal] = useState(false);

    // Avances
    const [nuevoAvance, setNuevoAvance] = useState({ mes: "", anio: "", valor: "" });
    const [mostrarEvolucion, setMostrarEvolucion] = useState(true);

    // Detalle del mes
    const [nuevoDetalleMes, setNuevoDetalleMes] = useState({ mes: "", anio: "", descripcion: "" });
    const [editandoDetalleIdx, setEditandoDetalleIdx] = useState(null);
    const [detalleEdit, setDetalleEdit] = useState({ mes: "", anio: "", descripcion: "" });

    // Fechas importantes
    const [fechas, setFechas] = useState([]);
    const [showFechasModal, setShowFechasModal] = useState(false);
    const [editFechasIdx, setEditFechasIdx] = useState(null);
    const [fechasForm, setFechasForm] = useState({
        fechainicio: "",
        fechafin: "",
        aumento: 0
    });

    const contenidoRef = useRef();

    // Obtener proyecto
    const fetchProyecto = async () => {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Error al cargar el proyecto");
            const data = await res.json();
            setProyecto(data);
            setForm({
                codigo: data.codigo || "",
                nombre: data.nombre || "",
                estado: data.estado || "",
                descripcion: data.descripcion || ""
            });
            setGeoForm({
                latitud: data.georeferencia?.latitud || "",
                longitud: data.georeferencia?.longitud || ""
            });
            setFechas(data.fechas || []);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    useEffect(() => { fetchProyecto(); }, [id]);

    // Handlers generales
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleGeoChange = e => setGeoForm({ ...geoForm, [e.target.name]: e.target.value });

    // Guardar datos generales
    const handleGuardar = async e => {
        e.preventDefault();
        setMensaje("");
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ ...proyecto, ...form })
        });
        if (res.ok) {
            setEditando(false);
            setMensaje("Proyecto actualizado correctamente.");
            fetchProyecto();
        } else {
            setMensaje("Error al actualizar el proyecto.");
        }
    };

    // Guardar georreferencia
    const handleGuardarGeo = async e => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ ...proyecto, georeferencia: { latitud: parseFloat(geoForm.latitud), longitud: parseFloat(geoForm.longitud) } })
        });
        if (res.ok) {
            setShowGeoModal(false);
            fetchProyecto();
        }
    };

    // Fechas importantes
    const handleFechasChange = e => {
        setFechasForm({ ...fechasForm, [e.target.name]: e.target.value });
    };

    const handleAgregarFechas = async e => {
        e.preventDefault();
        const nuevasFechas = [...fechas, { ...fechasForm }];
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ ...proyecto, fechas: nuevasFechas })
        });
        if (res.ok) {
            setShowFechasModal(false);
            setFechasForm({ fechainicio: "", fechafin: "", aumento: 0 });
            fetchProyecto();
        }
    };

    const handleEditarFechas = idx => {
        const f = fechas[idx];
        setFechasForm({
            fechainicio: f.fechainicio?.slice(0, 10) || "",
            fechafin: f.fechafin?.slice(0, 10) || "",
            aumento: f.aumento || 0
        });
        setEditFechasIdx(idx);
        setShowFechasModal(true);
    };

    const handleGuardarFechas = async e => {
        e.preventDefault();
        const nuevasFechas = [...fechas];
        nuevasFechas[editFechasIdx] = { ...fechasForm };
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ ...proyecto, fechas: nuevasFechas })
        });
        if (res.ok) {
            setShowFechasModal(false);
            setEditFechasIdx(null);
            setFechasForm({ fechainicio: "", fechafin: "", aumento: 0 });
            fetchProyecto();
        }
    };

    // Avances
    const handleAvanceChange = e => setNuevoAvance({ ...nuevoAvance, [e.target.name]: e.target.value });

    const handleAgregarAvance = async e => {
        e.preventDefault();
        const avanceActualizado = [...(proyecto.avance || []), {
            mes: parseInt(nuevoAvance.mes),
            anio: parseInt(nuevoAvance.anio),
            valor: parseFloat(nuevoAvance.valor)
        }];
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ ...proyecto, avance: avanceActualizado })
        });
        if (res.ok) {
            setNuevoAvance({ mes: "", anio: "", valor: "" });
            fetchProyecto();
        }
    };

    const handleBorrarAvance = async idx => {
        if (!window.confirm("¿Seguro que deseas eliminar este avance?")) return;
        const avanceActualizado = proyecto.avance.filter((_, i) => i !== idx);
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ ...proyecto, avance: avanceActualizado })
        });
        if (res.ok) fetchProyecto();
    };

    // Detalle del mes
    const handleDetalleMesChange = e => setNuevoDetalleMes({ ...nuevoDetalleMes, [e.target.name]: e.target.value });

    const handleAgregarDetalleMes = async e => {
        e.preventDefault();
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.detalledelmes = [
            ...(proyectoActualizado.detalledelmes || []),
            { ...nuevoDetalleMes }
        ];
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(proyectoActualizado)
        });
        if (res.ok) {
            setNuevoDetalleMes({ mes: "", anio: "", descripcion: "" });
            fetchProyecto();
        }
    };

    const handleEditarDetalleMes = idx => {
        const detalle = proyecto.detalledelmes[idx];
        setDetalleEdit({
            mes: detalle.mes,
            anio: detalle.anio,
            descripcion: detalle.descripcion
        });
        setEditandoDetalleIdx(idx);
    };

    const handleGuardarDetalleMes = async e => {
        e.preventDefault();
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.detalledelmes[editandoDetalleIdx] = { ...detalleEdit };
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(proyectoActualizado)
        });
        if (res.ok) {
            setEditandoDetalleIdx(null);
            fetchProyecto();
        }
    };

    const handleBorrarDetalleMes = async idx => {
        if (!window.confirm("¿Seguro que deseas borrar este detalle?")) return;
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.detalledelmes = proyectoActualizado.detalledelmes.filter((_, i) => i !== idx);
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(proyectoActualizado)
        });
        if (res.ok) fetchProyecto();
    };

    // Exportar a Word
    const exportarAWord = () => {
        const estilos = `
            <style>
                body { font-family: Arial, sans-serif; }
                h2, h3 { color: #1d4ed8; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
                th, td { border: 1px solid #d1d5db; padding: 8px; }
                th { background: #dbeafe; color: #1e293b; }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mt-10 { margin-top: 2.5rem; }
            </style>
        `;
        const docx = htmlDocx.asBlob(`<html><head>${estilos}</head><body>${contenidoRef.current.innerHTML}</body></html>`);
        saveAs(docx, `${proyecto.nombre || "proyecto"}.docx`);
    };

    if (loading) return <div className="p-8">Cargando...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!proyecto) return <div className="p-8">No se encontró el proyecto.</div>;

    return (
        <div className="w-auto mx-auto mt-2 bg-white rounded shadow p-4" ref={contenidoRef}>
            <button
                className="mb-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                onClick={exportarAWord}
            >
                Descargar como Word
            </button>

            {/* Datos generales */}
            <div className="w-auto mx-auto mt-2 bg-white rounded shadow p-8">
                <div>
                    <div className="w-full bg-blue-100 rounded">
                        <h2 className="text-2xl font-bold mb-4 px-2 py-2 text-black">{proyecto.nombre}</h2>
                    </div>
                    {mensaje && <div className="mb-4 text-green-700 font-semibold">{mensaje}</div>}
                    {editando ? (
                        <form onSubmit={handleGuardar} className="flex flex-col gap-4 mb-8">
                            <label>
                                <span className="font-semibold">Código:</span>
                                <input className="border rounded px-2 py-1 w-full" name="codigo" value={form.codigo} onChange={handleChange} />
                            </label>
                            <label>
                                <span className="font-semibold">Nombre:</span>
                                <input className="border rounded px-2 py-1 w-full" name="nombre" value={form.nombre} onChange={handleChange} />
                            </label>
                            <label>
                                <span className="font-semibold">Estado:</span>
                                <input className="border rounded px-2 py-1 w-full" name="estado" value={form.estado} onChange={handleChange} />
                            </label>
                            <label>
                                <span className="font-semibold">Detalle:</span>
                                <textarea className="border rounded px-2 py-1 w-full" name="descripcion" value={form.descripcion} onChange={handleChange} />
                            </label>
                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
                                <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400" onClick={() => { setEditando(false); setForm(proyecto); }}>Cancelar</button>
                            </div>
                        </form>
                    ) : (
                        <div className="relative">
                            <table className="mb-8 w-full border border-gray-300 rounded">
                                <tbody>
                                    <tr>
                                        <th className="bg-blue-100 px-4 py-2 text-left w-1/4">Nombre</th>
                                        <td className="px-4 py-2">{proyecto.nombre}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-blue-100 px-4 py-2 text-left">Código</th>
                                        <td className="px-4 py-2">{proyecto.codigo}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-blue-100 px-4 py-2 text-left">Estado</th>
                                        <td className="px-4 py-2">{proyecto.estado}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-blue-100 px-4 py-2 text-left">Descripcion</th>
                                        <td className="px-4 py-2">{proyecto.descripcion}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="absolute top-2 right-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setEditando(true)}>
                                <HiOutlineAdjustments />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Georreferencia */}
            <div className="w-auto">
                <div className="w-auto bg-blue-100 flex items-center justify-between px-4 py-2 rounded-t">
                    <h3 className="text-lg font-bold text-center flex-1">Georreferencia</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-4" onClick={() => setShowGeoModal(true)} type="button">
                        <HiOutlineAdjustments />
                    </button>
                </div>
                <div className="w-full">
                    {proyecto.georeferencia && proyecto.georeferencia.latitud && proyecto.georeferencia.longitud ? (
                        <iframe
                            title="mapa-georeferencia"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${proyecto.georeferencia.latitud},${proyecto.georeferencia.longitud}&output=embed`}
                        />
                    ) : (
                        <div className="px-4 py-2 text-center">No hay georreferencia registrada</div>
                    )}
                </div>
                {showGeoModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded shadow-lg p-8 w-full max-w-sm">
                            <h3 className="text-lg font-bold mb-4 text-center">Ingresar Georreferencia</h3>
                            <form
                                onSubmit={e => {
                                    handleGuardarGeo(e);
                                    setShowGeoModal(false);
                                }}
                                className="flex flex-col gap-4"
                            >
                                <input className="border rounded px-2 py-1" name="latitud" type="number" step="any" placeholder="Latitud" value={geoForm.latitud} onChange={handleGeoChange} required />
                                <input className="border rounded px-2 py-1" name="longitud" type="number" step="any" placeholder="Longitud" value={geoForm.longitud} onChange={handleGeoChange} required />
                                <div className="flex gap-2 justify-end">
                                    <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowGeoModal(false)}>Cancelar</button>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Fechas importantes */}
            <FechasProyecto fechas={fechas} setFechas={setFechas} />

            {/* Tabla de Avances */}
            <div className="mt-10">
                <h3 className="text-lg font-bold mb-2">Tabla de Avances Fisicos</h3>
                <table className="w-full border border-gray-300 rounded mb-8">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="px-4 py-2">Ingresar avance</th>
                            <th className="px-4 py-2">Detalle de avance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 text-center">
                                <div className="mt-10 mb-6">
                                    <h3 className="text-lg font-bold mb-2">Agregar avance mensual</h3>
                                    <form onSubmit={handleAgregarAvance} className="flex flex-wrap gap-2 items-end">
                                        <input className="border rounded px-2 py-1" name="mes" type="number" min="1" max="12" placeholder="Mes (1-12)" value={nuevoAvance.mes} onChange={handleAvanceChange} required />
                                        <input className="border rounded px-2 py-1" name="anio" type="number" min="2000" max="2100" placeholder="Año" value={nuevoAvance.anio} onChange={handleAvanceChange} required />
                                        <input className="border rounded px-2 py-1" name="valor" type="number" min="0" max="100" step="0.1" placeholder="Avance (%)" value={nuevoAvance.valor} onChange={handleAvanceChange} required />
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">Agregar</button>
                                    </form>
                                </div>
                            </td>
                            <td className="px-4 py-2 text-center">
                                {proyecto.avance && proyecto.avance.length > 0 && (
                                    <div className="mt-6">
                                        <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={() => setMostrarEvolucion(v => !v)}>
                                            {mostrarEvolucion ? "Ocultar evolución del avance" : "Mostrar evolución del avance"}
                                        </button>
                                        {mostrarEvolucion && (
                                            <>
                                                <h3 className="text-lg font-bold mb-2">Evolución del avance</h3>
                                                <table className="w-full border border-gray-300 rounded mb-8">
                                                    <thead>
                                                        <tr className="bg-blue-100">
                                                            <th className="px-4 py-2">Mes</th>
                                                            <th className="px-4 py-2">Año</th>
                                                            <th className="px-4 py-2">Avance (%)</th>
                                                            <th className="px-4 py-2">Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {proyecto.avance.map((a, idx) => (
                                                            <tr key={idx}>
                                                                <td className=" text-center">{a.mes}</td>
                                                                <td className=" text-center">{a.anio}</td>
                                                                <td className=" text-center">{a.valor}%</td>
                                                                <td className=" text-center">
                                                                    <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded" onClick={() => handleBorrarAvance(idx)} title="Eliminar avance">
                                                                        Eliminar
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </>
                                        )}
                                    </div>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Gráfico de avance */}
            {proyecto.avance && proyecto.avance.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-lg font-bold mb-2">Gráfico de avance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={proyecto.avance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="valor" stroke="#2563eb" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Detalle del Mes */}
            <div className="mt-10">
                <h3 className="text-lg font-bold mb-2">Detalle del Mes</h3>
                <table className="w-full border border-gray-300 rounded mb-8">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="px-4 py-2">Detalle del Mes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 text-center">
                                <div className="mt-10 mb-6">
                                    <h3 className="text-lg font-bold mb-2">Agregar detalle del mes</h3>
                                    <form onSubmit={handleAgregarDetalleMes} className="flex gap-2 mt-4">
                                        <input type="text" placeholder="Mes" value={nuevoDetalleMes.mes} onChange={e => setNuevoDetalleMes({ ...nuevoDetalleMes, mes: e.target.value })} className="border px-2 py-1 rounded" required />
                                        <input type="text" placeholder="Año" value={nuevoDetalleMes.anio} onChange={e => setNuevoDetalleMes({ ...nuevoDetalleMes, anio: e.target.value })} className="border px-2 py-1 rounded" required />
                                        <input type="text" placeholder="Descripción" value={nuevoDetalleMes.descripcion} onChange={e => setNuevoDetalleMes({ ...nuevoDetalleMes, descripcion: e.target.value })} className="border px-2 py-1 rounded" required />
                                        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Agregar</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Detalle del Mes Actualizado */}
            <div className="mt-10">
                <h3 className="text-lg font-bold mb-2">Detalle del Mes</h3>
                <table className="min-w-full border mt-2">
                    <thead>
                        <tr className="bg-blue-700 text-white">
                            <th className="px-4 py-2 border">Mes</th>
                            <th className="px-4 py-2 border">Año</th>
                            <th className="px-4 py-2 border">Descripción</th>
                            <th className="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proyecto.detalledelmes?.map((detalle, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                <td className="px-4 py-2 border">{detalle.mes}</td>
                                <td className="px-4 py-2 border">{detalle.anio}</td>
                                <td className="px-4 py-2 border">{detalle.descripcion}</td>
                                <td className="px-4 py-2 border text-center">
                                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded mr-2" onClick={() => handleEditarDetalleMes(idx)} title="Editar">
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                    <button className="bg-red-600 hover:bg-red-700 text-white p-1 rounded" onClick={() => handleBorrarDetalleMes(idx)} title="Borrar">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Modal de edición */}
                {editandoDetalleIdx !== null && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                            <h4 className="text-lg font-bold mb-4">Editar Detalle del Mes</h4>
                            <form onSubmit={handleGuardarDetalleMes} className="flex flex-col gap-3">
                                <div>
                                    <label className="block mb-1">Mes</label>
                                    <input type="text" name="mes" value={detalleEdit.mes} onChange={e => setDetalleEdit({ ...detalleEdit, mes: e.target.value })} className="w-full border px-2 py-1 rounded" required />
                                </div>
                                <div>
                                    <label className="block mb-1">Año</label>
                                    <input type="text" name="anio" value={detalleEdit.anio} onChange={e => setDetalleEdit({ ...detalleEdit, anio: e.target.value })} className="w-full border px-2 py-1 rounded" required />
                                </div>
                                <div>
                                    <label className="block mb-1">Descripción</label>
                                    <textarea name="descripcion" value={detalleEdit.descripcion} onChange={e => setDetalleEdit({ ...detalleEdit, descripcion: e.target.value })} className="w-full border px-2 py-1 rounded" required />
                                </div>
                                <div className="flex justify-end gap-2 mt-2">
                                    <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditandoDetalleIdx(null)}>Cancelar</button>
                                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="w-full bg-blue-100 flex items-center justify-between px-4 py-2 rounded-t">
                <Link to="/proyectos" className="inline-flex items-center mt-8 text-blue-700 hover:underline">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Volver a la lista de proyectos
                </Link>
            </div>
        </div>
    );
};

export default ProyectoDetalle;