import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export const ProyectoDetalle = () => {
    const { id } = useParams();
    const [proyecto, setProyecto] = useState(null);

    useEffect(() => {
        fetch(`https://telemetria-backend.onrender.com/api/proyectos/${id}`)
            .then(res => res.json())
            .then(setProyecto);
    }, [id]);

    if (!proyecto) {
        return <div className="p-8">Cargando...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded shadow p-8">
            <h2 className="text-2xl font-bold mb-4">{proyecto.nombre}</h2>
            <p><span className="font-semibold">Código:</span> {proyecto.codigo}</p>
            <p><span className="font-semibold">Estado:</span> {proyecto.estado}</p>
            <p><span className="font-semibold">Detalle:</span> {proyecto.descripcion}</p>
            {/* Agrega aquí más campos si tu backend los entrega */}
            <Link to="/proyectos" className="inline-block mt-6 text-blue-700 hover:underline">
                ← Volver a la lista de proyectos
            </Link>
        </div>
    );
};

export default ProyectoDetalle;