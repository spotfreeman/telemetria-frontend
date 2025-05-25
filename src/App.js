import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DatosPage from './DatosPage';
import { TempData } from './Pages/TempData';
import { Server } from './Pages/Server';
import { Notas } from './Pages/Notas';

import Sidebar from './Components/Sidebar';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          {/* Título principal */}
          <header className="bg-blue-700 py-6 px-8 mb-6 shadow">
            <h1 className="text-3xl font-bold text-white">Prototipo Telemetria</h1>
            <p className="text-white text-lg mt-2 opacity-80">
              Monitoreo en tiempo real de temperatura y datos de Raspberry Pi
            </p>
          </header>

          {/* Contenido enlaces */}
          <Routes>
            <Route path="/" element={<div>Telemetria Página principal</div>} />
            <Route path="/datos" element={<DatosPage />} />
            <Route path="/tempdata" element={<TempData />} />
            <Route path="/server" element={<Server />} />
            <Route path="/notas" element={<Notas />} />


            {/* Agrega más rutas según sea necesario */}
            {/* Ruta para manejar 404 */}
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
