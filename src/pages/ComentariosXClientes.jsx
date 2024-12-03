import React, { useState } from 'react';
import Sidebar from "../components/Siderbar";
import Swal from 'sweetalert2'; // Importamos SweetAlert para confirmar cambios
import "../style/comentarios.css";

const ComentariosXClientes = () => {
  const [comentarios, setComentarios] = useState([
    {
      id: 1,
      cliente: 'Juan Pérez',
      email: 'juan.perez@gmail.com',
      telefono: '555-1234',
      tipo: 'Queja',
      descripcion: 'El producto llegó dañado.',
      estatus: 'Pendiente',
      calificacion: 3,
      fecha: '2024-12-01',
      comentario_extendido: '',
    },
    {
      id: 2,
      cliente: 'María López',
      email: 'maria.lopez@gmail.com',
      telefono: '555-5678',
      tipo: 'Devolución',
      descripcion: 'Solicito devolver un producto.',
      estatus: 'Resuelto',
      calificacion: 5,
      fecha: '2024-11-30',
      comentario_extendido: 'Devolución exitosa.',
    },
    {
      id: 3,
      cliente: 'Pedro Sánchez',
      email: 'pedro.sanchez@gmail.com',
      telefono: '555-9876',
      tipo: 'Otros',
      descripcion: 'Consulta sobre el uso del producto.',
      estatus: 'Cancelado',
      calificacion: 4,
      fecha: '2024-11-29',
      comentario_extendido: 'Producto defectuoso.',
    },
  ]);

  const [motivo, setMotivo] = useState(''); // Motivo de la justificación
  const [selectedComentario, setSelectedComentario] = useState(null); // Comentario seleccionado para cambiar

  // Cambiar el estatus y agregar justificación
  const cambiarEstatus = (id, nuevoEstatus) => {
    if (nuevoEstatus === 'Resuelto' && motivo.trim() === '') {
      Swal.fire('Error', 'Debe proporcionar un motivo para resolver el comentario', 'error');
      return;
    }
    if (nuevoEstatus === 'Cancelado' && motivo.trim() === '') {
      Swal.fire('Error', 'Debe proporcionar un motivo para cancelar el comentario', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Cambiar el estatus a ${nuevoEstatus}.`,
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
        setMotivo(''); // Limpiar motivo
        setSelectedComentario(null); // Limpiar comentario seleccionado
        Swal.fire('Éxito', `El estatus se cambió a ${nuevoEstatus}`, 'success');
      }
    });
  };

  const calificarComentario = (id, calificacion) => {
    setComentarios((prevComentarios) =>
      prevComentarios.map((comentario) => {
        if (comentario.id === id) {
          comentario.calificacion = calificacion;
        }
        return comentario;
      })
    );
  };

  return (
    <div className="leads-layout">
      <Sidebar /> {/* Sidebar */}

      <div className="leads-card-container">
        <div className="leads-card">
          <div className="leads-header">
            <h1>Comentarios por Cliente</h1>
          </div>

          <div className="leads-list">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                  <th>Estatus</th>
                  <th>Acciones</th>
                  <th>Calificación</th>
                </tr>
              </thead>
              <tbody>
                {comentarios.map((comentario) => (
                  <tr key={comentario.id}>
                    <td>{comentario.cliente}</td>
                    <td>{comentario.email}</td>
                    <td>{comentario.telefono}</td>
                    <td>{comentario.tipo}</td>
                    <td>{comentario.descripcion}</td>
                    <td>{comentario.fecha}</td>
                    <td>{comentario.estatus}</td>
                    <td>
                      {/* Solo mostrar el select si el estatus es Pendiente */}
                      {comentario.estatus === 'Pendiente' && (
                        <select
                          onChange={(e) => setSelectedComentario({ id: comentario.id, estatus: e.target.value })}
                        >
                          <option value="">Cambiar Estatus</option>
                          <option value="Resuelto">Resuelto</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      )}
                    </td>
                    <td>
                      {/* Calificación */}
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star ${comentario.calificacion >= star ? 'filled' : ''}`}
                          onClick={() => calificarComentario(comentario.id, star)}
                        >
                          ★
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Si hay un comentario seleccionado y es Pendiente, mostramos el campo de justificación */}
            {selectedComentario && selectedComentario.estatus && (
              <div className="justificacion">
                <textarea
                  placeholder={`Justificar cambio a ${selectedComentario.estatus}`}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
                <button
                  onClick={() => cambiarEstatus(selectedComentario.id, selectedComentario.estatus)}
                >
                  Guardar Cambio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComentariosXClientes;
