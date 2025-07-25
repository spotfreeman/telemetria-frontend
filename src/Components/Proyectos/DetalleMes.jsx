import React from "react";
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

const DetalleMes = ({
    detalles,
    onEditar,
    onBorrar
}) => (
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
                {detalles?.map((detalle, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                        <td className="px-4 py-2 border">{detalle.mes}</td>
                        <td className="px-4 py-2 border">{detalle.anio}</td>
                        <td className="px-4 py-2 border">{detalle.descripcion}</td>
                        <td className="px-4 py-2 border text-center">
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded mr-2" onClick={() => onEditar(idx)} title="Editar">
                                <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white p-1 rounded" onClick={() => onBorrar(idx)} title="Borrar">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default DetalleMes;