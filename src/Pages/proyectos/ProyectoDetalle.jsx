import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";
import { HiOutlineAdjustments } from "react-icons/hi";
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

// Importacion de Componentes para Refactorizacion
import Georeferencia from "../../Components/Proyectos/Georeferencia";
import FechasImportantes from "../../Components/Proyectos/FechasImportantes";
import TablaAvances from "../../Components/Proyectos/TablaAvances";



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
    const [fechas, setFechas] = useState(proyecto?.fechas || []);
    const [showFechasModal, setShowFechasModal] = useState(false);
    const [editFechasIdx, setEditFechasIdx] = useState(null);
    const [fechasForm, setFechasForm] = useState({
        fechainicio: "",
        fechafin: "",
        aumento: 0
    });

    // Licitacion
    const [showLicitacionModal, setShowLicitacionModal] = useState(false);
    const [idLicitacionInput, setIdLicitacionInput] = useState("");

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
            console.log("Respuesta fetch:", res.status); // <-- agrega esto
            if (!res.ok) throw new Error("Error al cargar el proyecto");
            const data = await res.json();
            console.log("Datos recibidos:", data); // <-- agrega esto
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
            console.error("Error en fetchProyecto:", err); // <-- agrega esto
        }
        setLoading(false);
    };

    useEffect(() => { fetchProyecto(); }, [id]);

    // Sincroniza fechas si cambia el proyecto
    useEffect(() => {
        setFechas(proyecto?.fechas || []);
    }, [proyecto]);

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

    // Fechas importantes (INTEGRACIÓN SEGURA)
    const handleFechasChange = e => {
        setFechasForm({ ...fechasForm, [e.target.name]: e.target.value });
    };

    const guardarFechasEnBackend = async (nuevasFechas) => {
        const token = localStorage.getItem("token");
        const proyectoActualizado = { ...proyecto, fechas: nuevasFechas };
        await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(proyectoActualizado)
        });
        // Refresca el proyecto
        await fetchProyecto();
    };

    const handleAgregarFechas = async e => {
        e.preventDefault();
        const nuevasFechas = [
            ...(proyecto.fechas || []),
            { ...fechasForm, aumento: Number(fechasForm.aumento) } // <-- conversión aquí
        ];
        await guardarFechasEnBackend(nuevasFechas);
        setShowFechasModal(false);
        setFechasForm({ fechainicio: "", fechafin: "", aumento: 0 });
    };

    const handleEditarFechas = idx => {
        const f = proyecto.fechas[idx];
        setFechasForm({
            fechainicio: f.fechainicio ? f.fechainicio.slice(0, 10) : "",
            fechafin: f.fechafin ? f.fechafin.slice(0, 10) : "",
            aumento: f.aumento || 0
        });
        setEditFechasIdx(idx);
        setShowFechasModal(true);
    };

    const handleGuardarFechas = async e => {
        e.preventDefault();
        const nuevasFechas = [...proyecto.fechas];
        nuevasFechas[editFechasIdx] = { ...fechasForm, aumento: Number(fechasForm.aumento) };
        await guardarFechasEnBackend(nuevasFechas);
        setShowFechasModal(false);
        setEditFechasIdx(null);
        setFechasForm({ fechainicio: "", fechafin: "", aumento: 0 });
    };

    const handleBorrarFechas = async idx => {
        if (window.confirm("¿Seguro que deseas borrar esta fila?")) {
            const nuevasFechas = proyecto.fechas.filter((_, i) => i !== idx);
            await guardarFechasEnBackend(nuevasFechas);
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

    const handleAbrirLicitacionModal = () => {
        setIdLicitacionInput(
            proyecto.licitacion && proyecto.licitacion.length > 0
                ? proyecto.licitacion[0].idlicitacion
                : ""
        );
        setShowLicitacionModal(true);
    };
    // Guardar licitación
    const handleGuardarLicitacion = async (e) => {
        e.preventDefault();
        const nuevaLicitacion = [{ idlicitacion: idLicitacionInput }];
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ ...proyecto, licitacion: nuevaLicitacion })
        });
        if (res.ok) {
            setShowLicitacionModal(false);
            fetchProyecto();
        }
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

    // Función para parsear fechas tipo 'YYYY-MM-DD' a objeto Date seguro
    function parseFecha(fechaStr) {
        if (!fechaStr) return null;
        if (fechaStr instanceof Date) return fechaStr;
        if (typeof fechaStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
            const [anio, mes, dia] = fechaStr.split('-').map(Number);
            return new Date(anio, mes - 1, dia);
        }
        return new Date(fechaStr);
    }

    // Utilidad para mostrar fecha en formato DD-MM-YYYY
    function formatFecha(fechaStr) {
        if (!fechaStr) return "-";
        const f = fechaStr.slice(0, 10).split("-");
        return `${f[2]}-${f[1]}-${f[0]}`;
    }

    console.log("ID recibido:", id);

    if (loading) return <div className="p-8">Cargando...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!proyecto) return <div className="p-8">No se encontró el proyecto.</div>;

    const contenido = (
        <div className="w-auto mx-auto mt-2 bg-white rounded shadow p-4" ref={contenidoRef}>
            <button
                className="mb-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                onClick={exportarAWord}
            >
                Descargar como Word
            </button>
            <button
                className="mb-4 ml-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                onClick={() => window.print()}
            >
                Imprimir
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

            {/* Componente Georeferencia */}
            <Georeferencia
                georeferencia={proyecto.georeferencia}
                geoForm={geoForm}
                showGeoModal={showGeoModal}
                setShowGeoModal={setShowGeoModal}
                handleGeoChange={handleGeoChange}
                handleGuardarGeo={handleGuardarGeo}
            />

            {/* Componente Fechas Importantes */}
            <FechasImportantes
                fechas={proyecto.fechas}
                formatFecha={formatFecha}
                handleEditarFechas={handleEditarFechas}
                handleBorrarFechas={handleBorrarFechas}
                showFechasModal={showFechasModal}
                setShowFechasModal={setShowFechasModal}
                editFechasIdx={editFechasIdx}
                fechasForm={fechasForm}
                handleFechasChange={handleFechasChange}
                handleGuardarFechas={handleGuardarFechas}
                handleAgregarFechas={handleAgregarFechas}
                setFechasForm={setFechasForm}
                setEditFechasIdx={setEditFechasIdx}
            />


            {/* Modulo de Licitacion */}

            <div className="w-full bg-blue-200 flex items-center justify-between px-4 py-2 rounded-t text-center">
                <h3 className="text-lg font-bold mb-2">Modulo de Licitacion : </h3>
                <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={handleAbrirLicitacionModal}
                >
                    {proyecto.licitacion && proyecto.licitacion.length > 0 ? "Modificar" : "Agregar"} Licitación
                </button>
            </div>

            <div className="mb-4">
                <strong>ID Licitación:</strong>{" "}
                {proyecto.licitacion && proyecto.licitacion.length > 0
                    ? proyecto.licitacion[0].idlicitacion
                    : <span className="text-gray-500">No registrada</span>}
            </div>

            <div>
                <table className="w-full border border-gray-300 rounded mb-8">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="px-4 py-2">Fecha Publicacion</th>
                            <th className="px-4 py-2">Fecha Apertura Tecnica</th>
                            <th className="px-4 py-2">Fecha Adjudicacion Portal</th>
                            <th className="px-4 py-2">Aprueba Contrato</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Dato fila 1, col 1</td>
                            <td className="border px-4 py-2">Dato fila 1, col 2</td>
                            <td className="border px-4 py-2">Dato fila 1, col 3</td>
                            <td className="border px-4 py-2">Dato fila 1, col 4</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Dato fila 2, col 1</td>
                            <td className="border px-4 py-2">Dato fila 2, col 2</td>
                            <td className="border px-4 py-2">Dato fila 2, col 3</td>
                            <td className="border px-4 py-2">Dato fila 2, col 4</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showFechasModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">
                            {editFechasIdx !== null ? "Editar Fechas" : "Agregar Fechas"}
                        </h2>
                        <form
                            onSubmit={editFechasIdx !== null ? handleGuardarFechas : handleAgregarFechas}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="block mb-1">Fecha Inicio</label>
                                <input
                                    type="date"
                                    name="fechainicio"
                                    value={fechasForm.fechainicio}
                                    onChange={handleFechasChange}
                                    className="w-full border px-2 py-1 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Fecha Fin</label>
                                <input
                                    type="date"
                                    name="fechafin"
                                    value={fechasForm.fechafin}
                                    onChange={handleFechasChange}
                                    className="w-full border px-2 py-1 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Aumento (días)</label>
                                <input
                                    type="number"
                                    name="aumento"
                                    value={fechasForm.aumento}
                                    onChange={handleFechasChange}
                                    className="w-full border px-2 py-1 rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-3 py-1 rounded"
                                    onClick={() => setShowFechasModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-3 py-1 rounded"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Componente de Tabla de Avances */}

            <TablaAvances
                avance={proyecto.avance}
                nuevoAvance={nuevoAvance}
                mostrarEvolucion={mostrarEvolucion}
                handleAvanceChange={handleAvanceChange}
                handleAgregarAvance={handleAgregarAvance}
                setMostrarEvolucion={setMostrarEvolucion}
                handleBorrarAvance={handleBorrarAvance}
            />


            {/* Gráfico de avance */}
            {
                proyecto.avance && proyecto.avance.length > 0 && (
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
                )
            }



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

            {/* Modal de Licitación */}
            {
                showLicitacionModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4">
                                {proyecto.licitacion && proyecto.licitacion.length > 0 ? "Modificar" : "Agregar"} Licitación
                            </h2>
                            <form onSubmit={handleGuardarLicitacion} className="flex flex-col gap-4">
                                <div>
                                    <label className="block mb-1">ID Licitación</label>
                                    <input
                                        type="text"
                                        value={idLicitacionInput}
                                        onChange={e => setIdLicitacionInput(e.target.value)}
                                        className="w-full border px-2 py-1 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        className="bg-gray-400 text-white px-3 py-1 rounded"
                                        onClick={() => setShowLicitacionModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    )

    return contenido;
};

export default ProyectoDetalle;