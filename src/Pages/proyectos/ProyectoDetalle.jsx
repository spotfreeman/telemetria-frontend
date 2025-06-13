import React, { useEffect, useState, useRef } from "react";

import { HiOutlineAdjustments } from "react-icons/hi";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import { useParams, Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";

export const ProyectoDetalle = () => {
    const { id } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState({ codigo: "", nombre: "", estado: "", descripcion: "" });
    const [mensaje, setMensaje] = useState("");
    const [nuevoAvance, setNuevoAvance] = useState({ mes: "", anio: "", valor: "" });
    const [mostrarEvolucion, setMostrarEvolucion] = useState(true);
    const [geoForm, setGeoForm] = useState({
        latitud: proyecto?.georeferencia?.latitud || "",
        longitud: proyecto?.georeferencia?.longitud || ""
    });
    const [nuevoDetalleMes, setNuevoDetalleMes] = useState({ mes: "", anio: "", descripcion: "" });
    const [showGeoModal, setShowGeoModal] = useState(false);
    const contenidoRef = useRef();

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
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
            });
    }, [id]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGeoChange = e => {
        setGeoForm({ ...geoForm, [e.target.name]: e.target.value });
    };

    const handleGuardar = async e => {
        e.preventDefault();
        setMensaje("");
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            const actualizado = await res.json();
            setProyecto(actualizado);
            setEditando(false);
            setMensaje("Proyecto actualizado correctamente.");
        } else {
            setMensaje("Error al actualizar el proyecto.");
        }
    };

    const handleGuardarGeo = async e => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                ...proyecto,
                georeferencia: {
                    latitud: parseFloat(geoForm.latitud),
                    longitud: parseFloat(geoForm.longitud)
                }
            })
        });
        if (res.ok) {
            const actualizado = await res.json();
            setProyecto(actualizado);
        }
    };

    const handleAvanceChange = e => {
        setNuevoAvance({ ...nuevoAvance, [e.target.name]: e.target.value });
    };

    const handleAgregarAvance = async e => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const avanceActualizado = [...(proyecto.avance || []), {
            mes: parseInt(nuevoAvance.mes),
            anio: parseInt(nuevoAvance.anio),
            valor: parseFloat(nuevoAvance.valor)
        }];
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ ...proyecto, avance: avanceActualizado })
        });
        if (res.ok) {
            const actualizado = await res.json();
            setProyecto(actualizado);
            setNuevoAvance({ mes: "", anio: "", valor: "" });
        }
    };

    const handleBorrarAvance = async (idx) => {
        if (!window.confirm("¿Seguro que deseas eliminar este avance?")) return;
        const token = localStorage.getItem("token");
        // Elimina el avance por índice
        const avanceActualizado = proyecto.avance.filter((_, i) => i !== idx);
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ ...proyecto, avance: avanceActualizado })
        });
        if (res.ok) {
            const actualizado = await res.json();
            setProyecto(actualizado);
        }
    };

    const handleDetalleMesChange = e => {
        setNuevoDetalleMes({ ...nuevoDetalleMes, [e.target.name]: e.target.value });
    };

    const handleAgregarDetalleMes = async e => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const detalledelmesActualizado = [...(proyecto.detalledelmes || []), {
            mes: parseInt(nuevoDetalleMes.mes),
            anio: parseInt(nuevoDetalleMes.anio),
            descripcion: nuevoDetalleMes.descripcion
        }];
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ ...proyecto, detalledelmes: detalledelmesActualizado })
        });
        if (res.ok) {
            const actualizado = await res.json();
            setProyecto(actualizado);
            setNuevoDetalleMes({ mes: "", anio: "", descripcion: "" });
        }
    };

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
        const contenidoHTML = estilos + contenidoRef.current.innerHTML;
        const docx = htmlDocx.asBlob(`<html><head>${estilos}</head><body>${contenidoRef.current.innerHTML}</body></html>`);
        saveAs(docx, `${proyecto.nombre || "proyecto"}.docx`);
    };

    if (!proyecto) {
        return <div className="p-8">Cargando...</div>;
    }

    return (

        <div className="w-auto mx-auto mt-2 bg-white rounded shadow p-4" ref={contenidoRef}>
            <button
                className="mb-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                onClick={exportarAWord}
            >
                Descargar como Word
            </button>

            <div className="w-auto mx-auto mt-2 bg-white rounded shadow p-8">

                <div ref={contenidoRef}>
                    {/* TODO el contenido que quieres exportar */}
                    <div className="w-full bg-blue-100 rounded">
                        <h2 className="text-2xl font-bold mb-4 px-2 py-2 text-black">{proyecto.nombre}</h2>
                    </div>

                    {mensaje && <div className="mb-4 text-green-700 font-semibold">{mensaje}</div>}
                    {editando ? (
                        <form onSubmit={handleGuardar} className="flex flex-col gap-4 mb-8">
                            <label>
                                <span className="font-semibold">Código:</span>
                                <input
                                    className="border rounded px-2 py-1 w-full"
                                    name="codigo"
                                    value={form.codigo}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                <span className="font-semibold">Nombre:</span>
                                <input
                                    className="border rounded px-2 py-1 w-full"
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                <span className="font-semibold">Estado:</span>
                                <input
                                    className="border rounded px-2 py-1 w-full"
                                    name="estado"
                                    value={form.estado}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                <span className="font-semibold">Detalle:</span>
                                <textarea
                                    className="border rounded px-2 py-1 w-full"
                                    name="descripcion"
                                    value={form.descripcion}
                                    onChange={handleChange}
                                />
                            </label>
                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => { setEditando(false); setForm(proyecto); }}
                                >
                                    Cancelar
                                </button>
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
                            <button
                                className="absolute top-2 right-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={() => setEditando(true)}
                            >
                                <HiOutlineAdjustments />
                            </button>
                        </div>
                    )}
                    {/* ...tu código actual... */}
                </div>
            </div>

            {/* Tabla : MAPA */}

            <div className="w-auto">
                <div className="w-auto bg-blue-100">
                    <h3 className="text-lg font-bold mb-2 text-center">Georreferencia</h3>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-left"
                        onClick={() => setShowGeoModal(true)}
                        type="button"
                    >
                        <HiOutlineAdjustments />
                    </button>
                </div>
                <div className="w-auto">
                    {proyecto.georeferencia && proyecto.georeferencia.latitud && proyecto.georeferencia.longitud ? (
                        <tr>
                            <td className="px-4 py-2 text-center" colSpan={3}>
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
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td className="px-4 py-2 text-center" colSpan={3}>No hay georreferencia registrada</td>
                        </tr>
                    )}
                </div>
            </div>

            <div className="">
                <table className="w-full border border-gray-300 rounded">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="px-4 py-2 text-center w-1/2">
                                Ubicación
                            </th>
                            <th className="px-4 py-2 text-right w-1/2">
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={() => setShowGeoModal(true)}
                                    type="button"
                                >
                                    <HiOutlineAdjustments />
                                </button>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {proyecto.georeferencia && proyecto.georeferencia.latitud && proyecto.georeferencia.longitud ? (
                            <tr>
                                <td className="px-4 py-2 text-center" colSpan={3}>
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
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td className="px-4 py-2 text-center" colSpan={3}>No hay georreferencia registrada</td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
                            <input
                                className="border rounded px-2 py-1"
                                name="latitud"
                                type="number"
                                step="any"
                                placeholder="Latitud"
                                value={geoForm.latitud}
                                onChange={handleGeoChange}
                                required
                            />
                            <input
                                className="border rounded px-2 py-1"
                                name="longitud"
                                type="number"
                                step="any"
                                placeholder="Longitud"
                                value={geoForm.longitud}
                                onChange={handleGeoChange}
                                required
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                    onClick={() => setShowGeoModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    type="submit"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabla % de Avances  */}
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
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="mes"
                                            type="number"
                                            min="1"
                                            max="12"
                                            placeholder="Mes (1-12)"
                                            value={nuevoAvance.mes}
                                            onChange={handleAvanceChange}
                                            required
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="anio"
                                            type="number"
                                            min="2000"
                                            max="2100"
                                            placeholder="Año"
                                            value={nuevoAvance.anio}
                                            onChange={handleAvanceChange}
                                            required
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="valor"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            placeholder="Avance (%)"
                                            value={nuevoAvance.valor}
                                            onChange={handleAvanceChange}
                                            required
                                        />
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
                                            Agregar
                                        </button>
                                    </form>
                                </div>

                            </td>
                            <td className="px-4 py-2 text-center">

                                {/* Agregar avance mensual */}
                                {proyecto.avance && proyecto.avance.length > 0 && (
                                    <div className="mt-6">
                                        <button
                                            className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                            onClick={() => setMostrarEvolucion(v => !v)}
                                        >
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
                                                                    <button
                                                                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                                                                        onClick={() => handleBorrarAvance(idx)}
                                                                        title="Eliminar avance"
                                                                    >
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

            {/* GRAFICO */}
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


            {/* Agregar detalle del mes */}
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
                                    <form onSubmit={handleAgregarDetalleMes} className="flex flex-wrap gap-2 items-end">
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="mes"
                                            type="number"
                                            min="1"
                                            max="12"
                                            placeholder="Mes (1-12)"
                                            value={nuevoDetalleMes.mes}
                                            onChange={handleDetalleMesChange}
                                            required
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="anio"
                                            type="number"
                                            min="2000"
                                            max="2100"
                                            placeholder="Año"
                                            value={nuevoDetalleMes.anio}
                                            onChange={handleDetalleMesChange}
                                            required
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="descripcion"
                                            type="text"
                                            placeholder="Descripción del mes"
                                            value={nuevoDetalleMes.descripcion}
                                            onChange={handleDetalleMesChange}
                                            required
                                        />
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
                                            Agregar Detalle
                                        </button>
                                    </form>
                                </div>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Tabla Detalle del Mes Actualizada */}
            {proyecto.detalledelmes && proyecto.detalledelmes.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-2">Detalle mensual histórico</h3>
                    <table className="w-full border border-gray-300 rounded mb-8">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="px-4 py-2">Mes</th>
                                <th className="px-4 py-2">Año</th>
                                <th className="px-4 py-2">Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proyecto.detalledelmes.map((d, idx) => (
                                <tr key={idx}>
                                    <td className="px-4 py-2 text-center">{d.mes}</td>
                                    <td className="px-4 py-2 text-center">{d.anio}</td>
                                    <td className="px-4 py-2 text-center">{d.descripcion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}



            {/* Tabla FOOTER */}
            <div className="mt-10">
                <table className="w-full border border-gray-300 rounded mb-8">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="px-4 py-2">Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 text-center" >

                                <Link to="/proyectos" className="inline-flex items-center mt-8 text-blue-700 hover:underline">
                                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                                    Volver a la lista de proyectos
                                </Link>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProyectoDetalle;