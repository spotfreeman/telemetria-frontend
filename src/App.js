import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DatosPage from './DatosPage';


function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/datos">Datos</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div>Página principal</div>} />
        <Route path="/datos" element={<DatosPage />} />
      </Routes>
    </Router>
  );
}

export default App;
