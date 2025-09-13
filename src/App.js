import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import DatosPage from './DatosPage';
import { TempData } from './Pages/TempData';
import { Server } from './Pages/Server';
import { Notas } from './Pages/Notas';
import { Lista } from './Pages/proyectos/Lista';
import { ProyectoDetalle } from './Pages/proyectos/ProyectoDetalle';
import { Calendario } from './Pages/calendario/Calendario';
import { Archivos } from './Pages/archivos/Archivos';
import { Welcome } from './Pages/users';
import { Login } from './Pages/auth';
import { Page404 } from './Pages/Page404';
import { Intro, Profile } from './Pages/users';
import { Dashboard } from './Pages/Dashboard';

import { Esp32List } from './Pages/esp32/esp32list';
import { Esp32Detail } from './Pages/esp32/esp32detail';

import { Mercado } from './mercado/mercado';

import Sidebar from './Components/Sidebar';
import { Register } from './Pages/auth';
import { ThemeProvider } from './Contexts/ThemeContext';

function App() {
  useEffect(() => {
    document.title = "ROB-Data";
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">

          <Routes>
            <Route path="/" element={<Intro />} />

            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/datos" element={<DatosPage />} />
            <Route path="/tempdata" element={<TempData />} />
            <Route path="/server" element={<Server />} />
            <Route path="/notas" element={<Notas />} />
            <Route path='/calendario' element={<Calendario />} />
            <Route path="/archivos" element={<Archivos />} />
            <Route path='/bienvenida' element={<Welcome />} />
            <Route path="/usuarioconfig" element={<Profile />} />

            <Route path="/register" element={<Register />} />

            {/* Rutas de ESP32 */}
            <Route path="/esp32" element={<Esp32List />} />
            <Route path="/esp32/:deviceId" element={<Esp32Detail />} />

            {/* Ruta para Mercado */}
            <Route path="/mercado" element={<Mercado />} />

            {/* Rutas de proyectos */}
            <Route path="/proyectos" element={<Lista />} />
            <Route path="/proyectos/:id" element={<ProyectoDetalle />} />

            {/* Agrega más rutas según sea necesario */}

            {/* Ruta para manejar 404 */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
