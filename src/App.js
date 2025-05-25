import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DatosPage from './DatosPage';
import { TempData } from './Pages/TempData';


function App() {
  return (
    <Router>
      <nav className="bg-blue-600 p-4 flex gap-4">
        <Link to="/" className="text-white hover:underline">Inicio</Link>
        <Link to="/datos" className="text-white hover:underline">Datos Raspberry</Link>
        <Link to="/tempdata" className="text-white hover:underline">TempData solo test</Link>
      </nav>

      <Routes>
        <Route path="/" element={<div>Telemetria Página principal</div>} />
        <Route path="/datos" element={<DatosPage />} />
        <Route path="/tempdata" element={<TempData />} />
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;
