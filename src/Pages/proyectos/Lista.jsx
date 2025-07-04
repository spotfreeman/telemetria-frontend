import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export const Lista = () => {
    const [proyectos, setProyectos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        codigo: "",
        nombre: "",
        estado: ""
    });
    const [busqueda, setBusqueda] = useState("");
    const [busquedaCodigo, setBusquedaCodigo] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch('https://telemetria-backend.onrender.com/api/proyectos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setProyectos(Array.isArray(data) ? data : []);
            });
    }, []);

    const handleCrearProyecto = () => {
        setShowModal(true);
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem("token"); // Obtén el token guardado

        const res = await fetch('https://telemetria-backend.onrender.com/api/proyectos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Agrega el token aquí
            },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            const nuevoProyecto = await res.json();
            setProyectos([nuevoProyecto, ...proyectos]);
            setShowModal(false);
            setForm({ codigo: "", nombre: "", estado: "" });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ codigo: "", nombre: "", estado: "" });
    };

    // Filtrado por nombre
    const proyectosFiltrados = Array.isArray(proyectos)
        ? proyectos.filter(p =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
            p.codigo.toLowerCase().includes(busquedaCodigo.toLowerCase())
        )
        : [];

    return (
        <div className="flex flex-col items-center mt-8 w-full">
            <div>
                <h1 className="text-3xl font-bold mb-4">Gestión de Proyectos</h1>
                <p className="text-gray-600">Aquí puedes ver, crear y gestionar tus proyectos.</p>
            </div>
            <div className="w-full max-w-3xl flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                <h2 className="text-2xl font-bold">Buscador</h2>
                <div className="flex gap-2 w-full md:w-auto">
                    { /* Campo de búsqueda por código */}
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full md:w-64"
                        placeholder="Buscar por código..."
                        value={busquedaCodigo}
                        onChange={e => setBusquedaCodigo(e.target.value)}
                    />

                    { /* Campo de búsqueda por nombre */}
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full md:w-64"
                        placeholder="Buscar por nombre..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />


                    <button
                        className="bg-blue-700 text-white px-4 py-2 rounded shadow"
                        onClick={handleCrearProyecto}
                    >
                        Crear Proyecto
                    </button>
                </div>
            </div>

            {/* Modal para crear proyecto */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Crear Proyecto</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                className="border p-2 rounded"
                                name="codigo"
                                placeholder="Código"
                                value={form.codigo}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className="border p-2 rounded"
                                name="nombre"
                                placeholder="Nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className="border p-2 rounded"
                                name="estado"
                                placeholder="Estado"
                                value={form.estado}
                                onChange={handleChange}
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                    onClick={handleCloseModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Código</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Nombre</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {proyectosFiltrados.map((proyecto, idx) => (
                        <tr key={proyecto._id || idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{proyecto.codigo}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                <Link
                                    to={`/proyectos/${proyecto._id}`}
                                    className="text-blue-700 hover:underline font-semibold"
                                >
                                    {proyecto.nombre}
                                </Link>
                            </td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{proyecto.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Lista;