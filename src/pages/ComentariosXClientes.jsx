import React, { useState } from 'react';

const ComentariosXClientes = () => {
  // Estados para filtros, búsqueda y datos
  const [search, setSearch] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('Todos');
  const [estatusFiltro, setEstatusFiltro] = useState('Pendiente');

  // Datos simulados (se reemplazarán con el consumo de API)
  const comentarios = [
    {
      id: 1,
      cliente: 'Juan Pérez',
      tipo: 1, // Queja
      descripcion: 'El producto llegó dañado.',
      estatus: 0, // Pendiente
      calificacion: 3,
      fecha: '2024-12-01',
    },
    {
      id: 2,
      cliente: 'María López',
      tipo: 2, // Devolución
      descripcion: 'Solicito devolver un producto.',
      estatus: 1, // Resuelto
      calificacion: 5,
      fecha: '2024-11-30',
    },
    {
      id: 3,
      cliente: 'Pedro Sánchez',
      tipo: 4, // Otros
      descripcion: 'Consulta sobre el uso del producto.',
      estatus: 2, // Cancelado
      calificacion: 4,
      fecha: '2024-11-29',
    },
  ];

  // Filtrar comentarios
  const filtrarComentarios = () =>
    comentarios.filter((comentario) => {
      const coincideBusqueda = comentario.descripcion
        .toLowerCase()
        .includes(search.toLowerCase());
      const coincideTipo =
        tipoFiltro === 'Todos' || comentario.tipo.toString() === tipoFiltro;
      const coincideEstatus =
        estatusFiltro === 'Todos' || comentario.estatus.toString() === estatusFiltro;

      return coincideBusqueda && coincideTipo && coincideEstatus;
    });

  // Opciones de filtros
  const tipos = [
    { value: 'Todos', label: 'Todos' },
    { value: '1', label: 'Queja' },
    { value: '2', label: 'Devolución' },
    { value: '3', label: 'Asistencia Técnica' },
    { value: '4', label: 'Otros' },
  ];

  const estatus = [
    { value: 'Todos', label: 'Todos' },
    { value: '0', label: 'Pendiente' },
    { value: '1', label: 'Resuelto' },
    { value: '2', label: 'Cancelado' },
  ];

  return (
    <div className="leads-layout">
      <div className="leads-card-container">
        <div className="leads-card">
          <div className="leads-header">
            <h1>Comentarios por Cliente</h1>
          </div>
          <div className="leads-search">
            <input
              type="text"
              placeholder="Buscar por descripción"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filters">
            <select onChange={(e) => setTipoFiltro(e.target.value)} value={tipoFiltro}>
              {tipos.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => setEstatusFiltro(e.target.value)}
              value={estatusFiltro}
            >
              {estatus.map((est) => (
                <option key={est.value} value={est.value}>
                  {est.label}
                </option>
              ))}
            </select>
          </div>
          <div className="leads-list">
            {filtrarComentarios().map((comentario) => (
              <div
                key={comentario.id}
                className={`lead-card ${
                  comentario.estatus === 0
                    ? 'active'
                    : comentario.estatus === 1
                    ? 'resolved'
                    : 'inactive'
                }`}
              >
                <h3>{comentario.cliente}</h3>
                <p><strong>Tipo:</strong> {tipos.find((t) => t.value === comentario.tipo.toString())?.label}</p>
                <p><strong>Descripción:</strong> {comentario.descripcion}</p>
                <p><strong>Calificación:</strong> {comentario.calificacion}</p>
                <p><strong>Fecha:</strong> {comentario.fecha}</p>
                <p><strong>Estatus:</strong> {estatus.find((e) => e.value === comentario.estatus.toString())?.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComentariosXClientes;
