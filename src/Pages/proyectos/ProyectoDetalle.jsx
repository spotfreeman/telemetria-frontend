import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export const ProyectoDetalle = () => {
    const { id } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState({ codigo: "", nombre: "", estado: "", descripcion: "" });
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`)
            .then(res => res.json())
            .then(data => {
                setProyecto(data);
                setForm({
                    codigo: data.codigo || "",
                    nombre: data.nombre || "",
                    estado: data.estado || "",
                    descripcion: data.descripcion || ""
                });
            });
    }, [id]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGuardar = async e => {
        e.preventDefault();
        setMensaje("");
        const res = await fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
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

    if (!proyecto) {
        return <div className="p-8">Cargando...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded shadow p-8">
            <h2 className="text-2xl font-bold mb-4">{proyecto.nombre}</h2>
            {mensaje && <div className="mb-4 text-green-700 font-semibold">{mensaje}</div>}
            {editando ? (
                <form onSubmit={handleGuardar} className="flex flex-col gap-4">
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
                <>
                    <p><span className="font-semibold">Código:</span> {proyecto.codigo}</p>
                    <p><span className="font-semibold">Estado:</span> {proyecto.estado}</p>
                    <p><span className="font-semibold">Detalle:</span> {proyecto.descripcion}</p>
                    <button
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => setEditando(true)}
                    >
                        Editar
                    </button>
                </>
            )}
            <Link to="/proyectos" className="inline-block mt-6 text-blue-700 hover:underline">
                ← Volver a la lista de proyectos
            </Link>
        </div>
    );
};

export default ProyectoDetalle;