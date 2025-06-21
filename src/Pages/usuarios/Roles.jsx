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
                    </div>
                </div>
            </div>

            (if (rol == "Administrador") {
                <div> Usted es Administrador </div>
            }
            if (rol == "Supervisor") {
                <div> Usted es Supervisor </div>
            }
            if (rol == "Monitor") {
                <div> Usted es Usuario </div>
            }
            if (rol == "Invitado") {
                <div> Usted es Invitado </div>
            }
            )
        </>

    )
}

export default Roles