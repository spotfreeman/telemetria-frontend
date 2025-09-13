import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";

// Componentes refactorizados
import Georeferencia from "../../Components/Proyectos/Georeferencia";
import FechasImportantes from "../../Components/Proyectos/FechasImportantes";
import TablaAvances from "../../Components/Proyectos/TablaAvances";
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
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                        <svg className="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Cargando proyecto...</h3>
                    <p className="text-gray-600 mt-2">Obteniendo información del proyecto</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-md w-full text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar el proyecto</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    if (!proyecto) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-md w-full text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.343A7.962 7.962 0 0112 5c-2.34 0-4.29 1.009-5.824 2.57" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Proyecto no encontrado</h3>
                    <p className="text-gray-600 mb-4">El proyecto que buscas no existe o ha sido eliminado.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4" ref={contenidoRef}>
            <div className="max-w-7xl mx-auto">
                {/* Header del proyecto */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Información principal */}
                        <div className="flex-1">
                            <div className="flex items-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        {proyecto.nombre}
                                    </h1>
                                    <p className="text-gray-600 mt-1">Código: {proyecto.codigo}</p>
                                </div>
                            </div>

                            {/* Estado del proyecto */}
                            <div className="flex items-center gap-4">
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${proyecto.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                                        proyecto.estado === 'En Progreso' ? 'bg-blue-100 text-blue-800' :
                                            proyecto.estado === 'Planificación' ? 'bg-yellow-100 text-yellow-800' :
                                                proyecto.estado === 'En Revisión' ? 'bg-purple-100 text-purple-800' :
                                                    proyecto.estado === 'Pausado' ? 'bg-orange-100 text-orange-800' :
                                                        proyecto.estado === 'Cancelado' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full mr-2 ${proyecto.estado === 'Completado' ? 'bg-green-500' :
                                            proyecto.estado === 'En Progreso' ? 'bg-blue-500' :
                                                proyecto.estado === 'Planificación' ? 'bg-yellow-500' :
                                                    proyecto.estado === 'En Revisión' ? 'bg-purple-500' :
                                                        proyecto.estado === 'Pausado' ? 'bg-orange-500' :
                                                            proyecto.estado === 'Cancelado' ? 'bg-red-500' :
                                                                'bg-gray-500'
                                        }`}></div>
                                    {proyecto.estado}
                                </span>

                                {proyecto.descripcion && (
                                    <p className="text-gray-600 text-sm max-w-md">
                                        {proyecto.descripcion}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={exportarAWord}
                                className="flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Exportar Word
                            </button>

                            <button
                                onClick={() => window.print()}
                                className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Imprimir
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenido principal organizado en grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Columna principal - Información detallada */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Datos generales */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
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
                        </div>

                        {/* Fechas importantes */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
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
                        </div>

                        {/* Tabla de avances */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <TablaAvances
                                avance={proyecto.avance}
                                nuevoAvance={nuevoAvance}
                                mostrarEvolucion={mostrarEvolucion}
                                handleAvanceChange={handleAvanceChange}
                                handleAgregarAvance={handleAgregarAvance}
                                setMostrarEvolucion={setMostrarEvolucion}
                                handleBorrarAvance={handleBorrarAvance}
                            />
                        </div>

                        {/* Detalle del mes */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
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
                    </div>

                    {/* Columna lateral - Información complementaria */}
                    <div className="space-y-8">
                        {/* Georeferencia */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <Georeferencia
                                georeferencia={proyecto.georeferencia}
                                geoForm={geoForm}
                                showGeoModal={showGeoModal}
                                setShowGeoModal={setShowGeoModal}
                                handleGeoChange={handleGeoChange}
                                handleGuardarGeo={handleGuardarGeo}
                            />
                        </div>

                        {/* Licitación */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <Licitacion
                                licitacion={proyecto.licitacion}
                                showLicitacionModal={showLicitacionModal}
                                handleAbrirLicitacionModal={handleAbrirLicitacionModal}
                                idLicitacionInput={idLicitacionInput}
                                setIdLicitacionInput={setIdLicitacionInput}
                                handleGuardarLicitacion={handleGuardarLicitacion}
                                setShowLicitacionModal={setShowLicitacionModal}
                            />
                        </div>

                        {/* Información adicional del proyecto */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Información del Proyecto
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                    <span className="text-sm font-medium text-gray-600">ID del Proyecto</span>
                                    <span className="text-sm text-gray-800 font-mono">{proyecto._id}</span>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                    <span className="text-sm font-medium text-gray-600">Fecha de Creación</span>
                                    <span className="text-sm text-gray-800">
                                        {proyecto.createdAt ? new Date(proyecto.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                    <span className="text-sm font-medium text-gray-600">Última Actualización</span>
                                    <span className="text-sm text-gray-800">
                                        {proyecto.updatedAt ? new Date(proyecto.updatedAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>

                                {proyecto.avance && proyecto.avance.length > 0 && (
                                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                        <span className="text-sm font-medium text-gray-600">Total de Avances</span>
                                        <span className="text-sm text-gray-800">{proyecto.avance.length}</span>
                                    </div>
                                )}

                                {proyecto.fechas && proyecto.fechas.length > 0 && (
                                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                        <span className="text-sm font-medium text-gray-600">Fechas Importantes</span>
                                        <span className="text-sm text-gray-800">{proyecto.fechas.length}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Acciones rápidas */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Acciones Rápidas
                            </h3>

                            <div className="space-y-3">
                                <button
                                    onClick={() => window.history.back()}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Volver a la Lista
                                </button>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Actualizar Datos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProyectoDetalle;