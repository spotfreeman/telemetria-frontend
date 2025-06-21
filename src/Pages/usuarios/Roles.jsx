import React from 'react'

export const Roles = () => {

    const nombre = localStorage.getItem("nombre");
    const rol = localStorage.getItem("rol");


    return (
        <>
            <div className="flex min-h-full flex-1">
                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Bienvenido {nombre}</h2>
                        </div>
                        <div className="mt-6">
                            <p className="text-gray-600">Esta es la pagina de roles.</p>
                        </div>

                        <div>
                            <p className="mt-6 text-gray-600">Su rol es: <span className="font-bold">{rol}</span> en la DB</p>
                            <p className="mt-6 ">
                                {rol === "Administrador" && (
                                    <div>
                                        {/* Contenido solo para administradores */}
                                        Validacion eres Administrador.
                                    </div>

                                )}
                                {rol === "Supervisor" && (
                                    <div>
                                        {/* Contenido solo para administradores */}
                                        Validacion eres Supervisor.
                                    </div>
                                )}
                                {rol === "Monitor" && (
                                    <div>
                                        {/* Contenido solo para administradores */}
                                        Validacion eres Monitor.
                                    </div>
                                )}
                                {rol === "Invitado" && (
                                    <div>
                                        {/* Contenido solo para administradores */}
                                        Validacion eres Invitado.
                                    </div>
                                )}
                            </p>

                        </div>
                    </div>
                </div>
            </div>


        </>

    )
}

export default Roles