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
                                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
                                            Administrador Capsule
                                        </span>

                                        <p>otro objeto</p>

                                        <div>

                                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                                Email
                                            </label>

                                            <div className="mt-2">
                                                <input
                                                    defaultValue="you@example.com"
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    disabled
                                                    placeholder="you@example.com"
                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:outline-gray-200 sm:text-sm/6"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                )}
                                {rol === "Supervisor" && (
                                    <div>
                                        {/* Contenido solo para Supervisor */}
                                        Validacion eres Supervisor.
                                    </div>
                                )}
                                {rol === "Monitor" && (
                                    <div>
                                        {/* Contenido solo para Monitor */}
                                        Validacion eres Monitor.
                                    </div>
                                )}
                                {rol === "Invitado" && (
                                    <div>
                                        {/* Contenido solo para Invitado */}
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