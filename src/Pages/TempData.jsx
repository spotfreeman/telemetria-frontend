export const TempData = () => {
    return (
        <div>
            <h2>Tabla de Datos de Temperatura</h2>
            <table style={{ borderCollapse: 'collapse', margin: 'auto', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sensor</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Temperatura</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>2024-05-25</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>22°C</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>2024-05-24</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>21°C</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
