import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DatosPage from './DatosPage';
import { TempData } from './Pages/TempData';


function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/datos">Datos</Link>
        <Link to="/tempdata">TempData</Link>
      </nav>

      <Routes>
        <Route path="/" element={<div>Página principal</div>} />
        <Route path="/datos" element={<DatosPage />} />
        <Route path="/tempdata" element={<TempData />} />
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;
