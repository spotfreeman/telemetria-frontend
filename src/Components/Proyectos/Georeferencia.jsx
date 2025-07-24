import React from "react";
import { HiOutlineAdjustments } from "react-icons/hi";

const Georeferencia = ({
    georeferencia,
    geoForm,
    showGeoModal,
    setShowGeoModal,
    handleGeoChange,
    handleGuardarGeo
}) => (
    <div className="w-auto">
        <div className="w-auto bg-blue-100 flex items-center justify-between px-4 py-2 rounded-t">
            <h3 className="text-lg font-bold text-center flex-1">Georreferencia</h3>
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-4"
                onClick={() => setShowGeoModal(true)}
                type="button"
            >
                <HiOutlineAdjustments />
            </button>
        </div>
        <div className="w-full">
            {georeferencia && georeferencia.latitud && georeferencia.longitud ? (
                <iframe
                    title="mapa-georeferencia"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${georeferencia.latitud},${georeferencia.longitud}&output=embed`}
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
);

export default Georeferencia;