import React, { useState } from 'react';
import Sidebar from "../components/Siderbar";
import Swal from 'sweetalert2'; // Importamos SweetAlert
import "../style/comentarios.css";
const ComentariosXClientes = () => {
  // Estados para filtros, datos y justificación
  const [estatusFiltro, setEstatusFiltro] = useState('Pendiente');
  const [comentarios, setComentarios] = useState([
    {
      id: 1,
      cliente: 'Juan Pérez',
      tipo: 1, // Queja
      descripcion: 'El producto llegó dañado.',
      estatus: 0, // Pendiente
      calificacion: 3,
      fecha: '2024-12-01',
      comentario_extendido: '',
    },
    {
      id: 2,
      cliente: 'María López',
      tipo: 2, // Devolución
      descripcion: 'Solicito devolver un producto.',
      estatus: 1, // Resuelto
      calificacion: 5,
      fecha: '2024-11-30',
      comentario_extendido: 'Devolución exitosa',
    },
    {
      id: 3,
      cliente: 'Pedro Sánchez',
      tipo: 4, // Otros
      descripcion: 'Consulta sobre el uso del producto.',
      estatus: 2, // Cancelado
      calificacion: 4,
      fecha: '2024-11-29',
      comentario_extendido: 'Producto defectuoso.',
    },
  ]);
  const [motivoResuelto, setMotivoResuelto] = useState(''); // Para almacenar el motivo de resolución
  const [motivoCancelado, setMotivoCancelado] = useState(''); // Para almacenar el motivo de cancelación

  // Filtrar comentarios por estatus
  const filtrarComentarios = () =>
    comentarios.filter((comentario) => {
      return estatusFiltro === 'Todos' || comentario.estatus.toString() === estatusFiltro;
    });

  // Cambiar estatus y justificar si es necesario
  const cambiarEstatus = (id, nuevoEstatus) => {
    let motivo = '';
    if (nuevoEstatus === 1 && motivoResuelto.trim() === '') {
      Swal.fire('Error', 'Debe proporcionar un motivo para resolver el comentario', 'error');
      return;
    }
    if (nuevoEstatus === 2 && motivoCancelado.trim() === '') {
      Swal.fire('Error', 'Debe proporcionar un motivo para cancelar el comentario', 'error');
      return;
    }

    if (nuevoEstatus === 1) {
      motivo = motivoResuelto;
    } else if (nuevoEstatus === 2) {
      motivo = motivoCancelado;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Cambiar el estatus a ${nuevoEstatus === 1 ? 'Resuelto' : 'Cancelado'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setComentarios((prevComentarios) =>
          prevComentarios.map((comentario) => {
            if (comentario.id === id) {
              comentario.estatus = nuevoEstatus;
              comentario.comentario_extendido = motivo;
            }
            return comentario;
          })
        );
        Swal.fire('Éxito', `El estatus se cambió a ${nuevoEstatus === 1 ? 'Resuelto' : 'Cancelado'}`, 'success');
      }
    });
  };

  // Opciones de estatus
  const estatus = [
    { value: 'Todos', label: 'Todos' },
    { value: '0', label: 'Pendiente' },
    { value: '1', label: 'Resuelto' },
    { value: '2', label: 'Cancelado' },
  ];

  return (
    <div className="leads-layout">
      <Sidebar /> {/* Consumir el Sidebar */}

      <div className="leads-card-container">
        <div className="leads-card">
          <div className="leads-header">
            <h1>Comentarios por Cliente</h1>
          </div>

          <div className="filters">
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
                <p><strong>Tipo:</strong> {comentario.tipo}</p>
                <p><strong>Descripción:</strong> {comentario.descripcion}</p>
                <p><strong>Calificación:</strong> {comentario.calificacion}</p>
                <p><strong>Fecha:</strong> {comentario.fecha}</p>
                <p><strong>Estatus:</strong> {estatus.find((e) => e.value === comentario.estatus.toString())?.label}</p>

                {/* Mostrar campos para justificación según el estatus */}
                {comentario.estatus === 1 && (
                  <>
                    <p><strong>Comentario Extendendido:</strong> {comentario.comentario_extendido}</p>
                  </>
                )}
                {comentario.estatus === 0 && (
                  <div>
                    <button onClick={() => cambiarEstatus(comentario.id, 1)}>
                      Marcar como Resuelto
                    </button>
                    <button onClick={() => cambiarEstatus(comentario.id, 2)}>
                      Marcar como Cancelado
                    </button>
                  </div>
                )}

                {/* Inputs para justificar los cambios */}
                {comentario.estatus === 0 && (
                  <div>
                    <textarea
                      placeholder="Motivo para resolver"
                      value={motivoResuelto}
                      onChange={(e) => setMotivoResuelto(e.target.value)}
                    />
                    <textarea
                      placeholder="Motivo para cancelar"
                      value={motivoCancelado}
                      onChange={(e) => setMotivoCancelado(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComentariosXClientes;
