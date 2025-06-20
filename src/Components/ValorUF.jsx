import { useEffect, useState } from "react";

export function ValorUF() {
    const [uf, setUf] = useState(null);

    useEffect(() => {
        fetch("https://mindicador.cl/api/uf")
            .then(res => res.json())
            .then(data => {
                if (data && data.serie && data.serie.length > 0) {
                    setUf(data.serie[0].valor);
                }
            })
            .catch(() => setUf(null));
    }, []);

    return (
        <span className="mt-1 text-blue-200 text-xs">
            UF: {uf ? uf.toLocaleString("es-CL", { minimumFractionDigits: 2 }) : "Cargando..."}
        </span>
    );
}