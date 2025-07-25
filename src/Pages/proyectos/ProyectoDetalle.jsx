import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";

// Componentes refactorizados
import Georeferencia from "../../Components/Proyectos/Georeferencia";
import FechasImportantes from "../../Components/Proyectos/FechasImportantes";
import TablaAvances from "../../Components/Proyectos/TablaAvances";
import DetalleMes from "../../Components/Proyectos/DetalleMes";
import DetalleMesTabla from "../../Components/Proyectos/DetalleMesTabla";
import DatosGenerales from "../../Components/Proyectos/DatosGenerales";
import Licitacion from "../../Components/Proyectos/Licitacion";

export const ProyectoDetalle = () => {
    const { id } = useParams();

    // --- Estados principales ---
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    // --- Estados de edición y formularios ---
    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState({ codigo: "", nombre: "", estado: "", descripcion: "" });

    // --- Georreferencia ---
    const [geoForm, setGeoForm] = useState({ latitud: "", longitud: "" });
    const [showGeoModal, setShowGeoModal] = useState(false);

    // --- Fechas importantes ---
    const [showFechasModal, setShowFechasModal] = useState(false);
    const [editFechasIdx, setEditFechasIdx] = useState(null);
    const [fechasForm, setFechasForm] = useState({ fechainicio: "", fechafin: "", aumento: 0 });

    // --- Avances ---
    const [nuevoAvance, setNuevoAvance] = useState({ mes: "", anio: "", valor: "" });
    const [mostrarEvolucion, setMostrarEvolucion] = useState(true);

    // --- Detalle del mes ---
    const [nuevoDetalleMes, setNuevoDetalleMes] = useState({ mes: "", anio: "", descripcion: "" });
    const [editandoDetalleIdx, setEditandoDetalleIdx] = useState(null);
    const [detalleEdit, setDetalleEdit] = useState({ mes: "", anio: "", descripcion: "" });

    // --- Licitación ---
    const [showLicitacionModal, setShowLicitacionModal] = useState(false);
    const [idLicitacionInput, setIdLicitacionInput] = useState("");

    // --- Referencia para exportar a Word ---
    const contenidoRef = useRef();

    // --- Fetch de datos del proyecto ---
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
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    useEffect(() => { fetchProyecto(); }, [id]);

    // --- Handlers de Datos Generales ---
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
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

    // --- Handlers de Georreferencia ---
    const handleGeoChange = e => setGeoForm({ ...geoForm, [e.target.name]: e.target.value });
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

    // --- Handlers de Fechas Importantes ---
    const handleFechasChange = e => setFechasForm({ ...fechasForm, [e.target.name]: e.target.value });
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
        await fetchProyecto();
    };
    const handleAgregarFechas = async e => {
        e.preventDefault();
        const nuevasFechas = [
            ...(proyecto.fechas || []),
            { ...fechasForm, aumento: Number(fechasForm.aumento) }
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

    // --- Handlers de Avances ---
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

    // --- Handlers de Detalle del Mes ---
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

    // --- Handlers de Licitación ---
    const handleAbrirLicitacionModal = () => {
        setIdLicitacionInput(
            proyecto.licitacion && proyecto.licitacion.length > 0
                ? proyecto.licitacion[0].idlicitacion
                : ""
        );
        setShowLicitacionModal(true);
    };
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

    // --- Utilidades ---
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

    function formatFecha(fechaStr) {
        if (!fechaStr) return "-";
        const f = fechaStr.slice(0, 10).split("-");
        return `${f[2]}-${f[1]}-${f[0]}`;
    }

    // --- Renderizado principal ---
    if (loading) return <div className="p-8">Cargando...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!proyecto) return <div className="p-8">No se encontró el proyecto.</div>;

    return (
        <div className="w-auto mx-auto mt-2 bg-white rounded shadow p-4" ref={contenidoRef}>
            {/* Botones principales */}
            <button className="mb-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={exportarAWord}>
                Descargar como Word
            </button>
            <button className="mb-4 ml-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800" onClick={() => window.print()}>
                Imprimir
            </button>

            {/* Datos generales */}
            <DatosGenerales
                proyecto={proyecto}
                mensaje={mensaje}
                editando={editando}
                form={form}
                handleChange={handleChange}
                handleGuardar={handleGuardar}
                setEditando={setEditando}
                setForm={setForm}
            />

            {/* Georeferencia */}
            <Georeferencia
                georeferencia={proyecto.georeferencia}
                geoForm={geoForm}
                showGeoModal={showGeoModal}
                setShowGeoModal={setShowGeoModal}
                handleGeoChange={handleGeoChange}
                handleGuardarGeo={handleGuardarGeo}
            />

            {/* Fechas importantes */}
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

            {/* Licitación */}
            <Licitacion
                licitacion={proyecto.licitacion}
                showLicitacionModal={showLicitacionModal}
                handleAbrirLicitacionModal={handleAbrirLicitacionModal}
                idLicitacionInput={idLicitacionInput}
                setIdLicitacionInput={setIdLicitacionInput}
                handleGuardarLicitacion={handleGuardarLicitacion}
                setShowLicitacionModal={setShowLicitacionModal}
            />

            {/* Tabla de avances */}
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

            {/* Detalle del mes */}
            <DetalleMes
                detalles={proyecto.detalledelmes}
                onEditar={handleEditarDetalleMes}
                onBorrar={handleBorrarDetalleMes}
            />

            {/* Detalle del mes actualizado */}
            <DetalleMesTabla
                detalles={proyecto.detalledelmes}
                onEditar={handleEditarDetalleMes}
                onBorrar={handleBorrarDetalleMes}
                editandoDetalleIdx={editandoDetalleIdx}
                detalleEdit={detalleEdit}
                setDetalleEdit={setDetalleEdit}
                setEditandoDetalleIdx={setEditandoDetalleIdx}
                handleGuardarDetalleMes={handleGuardarDetalleMes}
            />
        </div>
    );
};

export default ProyectoDetalle;