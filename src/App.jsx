import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Marketing from './pages/Marketing';
import Ventas from './pages/Ventas';
import Planificacion from './pages/Planificacion';
import Empresa from './pages/Empresa';
import ComentariosXClientes from './pages/COmentariosXClientes';
import CuentasXPagar from './pages/CuentasXPagar';
import NotFoundPage from './pages/NotFoundPage';
import HistorialComunicacion from './pages/HistorialComunicacion';


const App = () => {
    return (
        <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clientes" element={<Leads />} />
          ###
          <Route path="/empresa" element={<Empresa />} />
      <Route path="/Comentarios por cliente" element={<ComentariosXClientes />} />
      {/* <Route path="/Cuentas por pagar" element={<CuentasXPagar />} /> */}
      <Route path="/enviar-cotizacion/:cotizacion" element={<CuentasXPagar />} />
      <Route path="/Historial" element={<HistorialComunicacion />} />
      <Route path="/marketing" element={<Marketing />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/planificacion" element={<Planificacion />} />
      <Route path="*" element={<NotFoundPage />} /> {/* Ruta "catch-all" */}

    </Routes>
</Router>

    );
};

export default App;
