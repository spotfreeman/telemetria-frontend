import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export const Calendario = () => {
    const [value, setValue] = useState(new Date());

    return (
        <div className="flex flex-col items-center mt-10">
            <h2 className="text-2xl font-bold mb-4">Calendario</h2>
            <Calendar
                onChange={setValue}
                value={value}
            />
            <p className="mt-4">Fecha seleccionada: {value.toLocaleDateString()}</p>
        </div>
    );
};

export default Calendario;