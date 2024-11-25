import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Marketing from './pages/Marketing';
import Ventas from './pages/Ventas';
import Planificacion from './pages/Planificacion';

const App = () => {
    return (
        <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clientes" element={<Leads />} />
      <Route path="/marketing" element={<Marketing />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/planificacion" element={<Planificacion />} />
    </Routes>
</Router>

    );
};

export default App;
