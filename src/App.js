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
import { Bienvenida } from './Pages/usuarios/Bienvenida';
import { Login2 } from './Pages/login/Login2';
import { Page404 } from './Pages/Page404';
import { Intro } from './Pages/usuarios/Intro';
import { Usuarioconfig } from './Pages/usuarios/Usuarioconfig';
import { Roles } from './Pages/usuarios/Roles';

import { Esp32List } from './Pages/esp32/esp32list';
import { Esp32Detail } from './Pages/esp32/esp32detail';

import { Mercado } from './mercado/mercado';

import Sidebar from './Components/Sidebar';
import { Registrar } from './Pages/usuarios/Registrar';

function App() {
  useEffect(() => {
    document.title = "ROB-Data";
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">

          <Routes>
            <Route path="/" element={<Intro />} />

            <Route path="/login" element={<Login2 />} />

            <Route path="/datos" element={<DatosPage />} />
            <Route path="/tempdata" element={<TempData />} />
            <Route path="/server" element={<Server />} />
            <Route path="/notas" element={<Notas />} />
            <Route path='/calendario' element={<Calendario />} />
            <Route path="/archivos" element={<Archivos />} />
            <Route path='/bienvenida' element={<Bienvenida />} />
            <Route path="/usuarioconfig" element={<Usuarioconfig />} />
            <Route path="/roles" element={<Roles />} />


            <Route path="/register" element={<Registrar />} />

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
  );
}

export default App;
