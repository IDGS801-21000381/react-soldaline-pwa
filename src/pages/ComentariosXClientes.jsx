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
    {
    "id": 4,
    "cliente": "Carlos Ruiz",
    "email": "carlos.ruiz@example.com",
    "telefono": "555-7890",
    "tipo": "Queja",
    "descripcion": "El producto no llegó a tiempo.",
    "estatus": "Pendiente",
    "calificacion": 2,
    "fecha": "2024-12-02",
    "comentario_extendido": ""
  },
  {
    "id": 5,
    "cliente": "Ana Martínez",
    "email": "ana.martinez@example.com",
    "telefono": "555-2345",
    "tipo": "Consulta",
    "descripcion": "¿El producto tiene garantía?",
    "estatus": "Pendiente",
    "calificacion": 3,
    "fecha": "2024-12-02",
    "comentario_extendido": ""
  },
  {
    "id": 6,
    "cliente": "Luis Gómez",
    "email": "luis.gomez@example.com",
    "telefono": "555-3456",
    "tipo": "Devolución",
    "descripcion": "El producto no cumple con las especificaciones.",
    "estatus": "Resuelto",
    "calificacion": 4,
    "fecha": "2024-12-01",
    "comentario_extendido": "Producto devuelto con éxito."
  },
  {
    "id": 7,
    "cliente": "Sofía Morales",
    "email": "sofia.morales@example.com",
    "telefono": "555-4567",
    "tipo": "Queja",
    "descripcion": "El pedido estaba incompleto.",
    "estatus": "Resuelto",
    "calificacion": 5,
    "fecha": "2024-11-30",
    "comentario_extendido": "Pedido completado después de la queja."
  },
  {
    "id": 8,
    "cliente": "Jorge Herrera",
    "email": "jorge.herrera@example.com",
    "telefono": "555-5678",
    "tipo": "Consulta",
    "descripcion": "¿Cuándo llegará mi pedido?",
    "estatus": "Cancelado",
    "calificacion": 3,
    "fecha": "2024-11-29",
    "comentario_extendido": "Pedido cancelado por falta de stock."
  },
  {
    "id": 9,
    "cliente": "Gabriela Torres",
    "email": "gabriela.torres@example.com",
    "telefono": "555-6789",
    "tipo": "Otros",
    "descripcion": "¿Ofrecen descuentos por compras grandes?",
    "estatus": "Pendiente",
    "calificacion": 4,
    "fecha": "2024-12-02",
    "comentario_extendido": ""
  },
  {
    "id": 10,
    "cliente": "Ricardo Mendoza",
    "email": "ricardo.mendoza@example.com",
    "telefono": "555-7891",
    "tipo": "Queja",
    "descripcion": "El producto llegó en mal estado.",
    "estatus": "Pendiente",
    "calificacion": 2,
    "fecha": "2024-12-02",
    "comentario_extendido": ""
  },
  {
    "id": 11,
    "cliente": "Mónica Sánchez",
    "email": "monica.sanchez@example.com",
    "telefono": "555-8901",
    "tipo": "Devolución",
    "descripcion": "Quiero cambiar el producto por otro modelo.",
    "estatus": "Pendiente",
    "calificacion": 5,
    "fecha": "2024-12-01",
    "comentario_extendido": ""
  },
  {
    "id": 12,
    "cliente": "Alberto Rojas",
    "email": "alberto.rojas@example.com",
    "telefono": "555-9012",
    "tipo": "Consulta",
    "descripcion": "¿Puedo recoger el producto en tienda?",
    "estatus": "Resuelto",
    "calificacion": 4,
    "fecha": "2024-11-30",
    "comentario_extendido": "Consulta resuelta con información sobre la tienda."
  },
  {
    "id": 13,
    "cliente": "Laura Fernández",
    "email": "laura.fernandez@example.com",
    "telefono": "555-0123",
    "tipo": "Queja",
    "descripcion": "El producto tiene piezas faltantes.",
    "estatus": "Pendiente",
    "calificacion": 1,
    "fecha": "2024-12-02",
    "comentario_extendido": ""
  }

  ]);

  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 5; // Número de registros por página

  const totalPages = Math.ceil(comentarios.length / itemsPerPage); // Número total de páginas
  const paginatedComentarios = comentarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ); // Registros de la página actual

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
        setMotivo('');
        setSelectedComentario(null);
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
      <Sidebar />

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
                {paginatedComentarios.map((comentario) => (
                  <tr key={comentario.id}>
                    <td>{comentario.cliente}</td>
                    <td>{comentario.email}</td>
                    <td>{comentario.telefono}</td>
                    <td>{comentario.tipo}</td>
                    <td>{comentario.descripcion}</td>
                    <td>{comentario.fecha}</td>
                    <td>{comentario.estatus}</td>
                    <td>
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

            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span>Página {currentPage} de {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComentariosXClientes;
