export const TempData = () => {
    return (
        <div className="flex flex-col items-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Tabla de Datos de Temperatura</h2>
            <table className="min-w-[300px] border border-gray-300 rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        <th className="px-4 py-2 border-b border-gray-300">Sensor</th>
                        <th className="px-4 py-2 border-b border-gray-300">Temperatura</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-gray-100">
                        <td className="px-4 py-2 text-center border-b border-gray-300">2024-05-25</td>
                        <td className="px-4 py-2 text-center border-b border-gray-300">22°C</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 text-center border-b border-gray-300">2024-05-24</td>
                        <td className="px-4 py-2 text-center border-b border-gray-300">21°C</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
