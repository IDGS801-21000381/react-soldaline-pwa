import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../components/Siderbar';
import "../style/Comentario.css"; // Estilos personalizados

const ComentariosXClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [mostrarVista, setMostrarVista] = useState('correo');
  const [justificaciones, setJustificaciones] = useState({}); // Almacena las justificaciones por ID

  // Cargar justificaciones y estatus guardados en localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('comentariosData')) || {};
    setJustificaciones(storedData);
  }, []);

  // Guardar justificaciones y estatus en localStorage
  const guardarEnLocalStorage = (id, nuevoEstatus, justificacion = "") => {
    const updatedData = {
      ...justificaciones,
      [id]: { estatus: nuevoEstatus, justificacion },
    };
    setJustificaciones(updatedData);
    localStorage.setItem('comentariosData', JSON.stringify(updatedData));
  };

  // Cargar clientes desde la API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(
          "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista"
        );
        setClientes(response.data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudieron cargar los datos de los clientes.", "error");
      }
    };

    fetchClientes();
  }, []);

  // Cargar comentarios desde la API
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(
          "https://bazar20241109230927.azurewebsites.net/api/ComentariosCliente/getAll"
        );
        const formattedData = response.data.map((item) => {
          const parts = item.descripcion.split('|');
          const localData = justificaciones[item.id] || {};

          return {
            id: item.id,
            nombre: parts[0] || 'Sin Nombre',
            empresa: parts[1] || 'Sin Empresa',
            contacto: parts[2] || 'Sin Contacto',
            descripcion: parts[3] || 'Sin Descripción',
            fecha: item.fecha,
            tipo: item.tipo === 1 ? 'Queja' : item.tipo === 2 ? 'Comentario' : 'Solicitud de devolución',
            estatus: localData.estatus || (item.estatus === 0 ? 'Solicitud' : item.estatus === 1 ? 'Procesando' : 'Finalizado'),
            calificacion: item.calificacion,
            justificacion: localData.justificacion || '',
          };
        });
        setComentarios(formattedData);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudieron cargar los datos de los comentarios.", "error");
      }
    };

    fetchComentarios();
  }, [justificaciones]);

  // Cambiar estatus
  const cambiarEstatus = (id, nuevoEstatus) => {
    if (nuevoEstatus === 'Finalizado') {
      Swal.fire({
        title: 'Justificación requerida',
        input: 'text',
        inputLabel: 'Razón para finalizar',
        inputPlaceholder: 'Escribe la justificación...',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
      }).then((result) => {
        if (result.isConfirmed) {
          const justificacion = result.value || 'Sin Justificación';
          actualizarComentario(id, nuevoEstatus, justificacion);
        }
      });
    } else {
      actualizarComentario(id, nuevoEstatus);
    }
  };

  // Actualizar comentario y guardar en localStorage
  const actualizarComentario = (id, nuevoEstatus, justificacion = "") => {
    setComentarios((prevComentarios) =>
      prevComentarios.map((comentario) =>
        comentario.id === id
          ? {
              ...comentario,
              estatus: nuevoEstatus,
              justificacion: nuevoEstatus === 'Finalizado' ? justificacion : '',
            }
          : comentario
      )
    );
    guardarEnLocalStorage(id, nuevoEstatus, justificacion);
    Swal.fire("Éxito", "Estatus cambiado correctamente.", "success");
  };

  return (
    <div className="comentarios-layout">
      <Sidebar />
      <div className="comentarios-container">
        <div className="comentarios-card">
          <h2 className="titulo">Gestión de Comentarios</h2>
          <div className="comentarios-botones">
            <button
              onClick={() => setMostrarVista('correo')}
              className={`comentarios-btn ${mostrarVista === 'correo' ? 'activo' : ''}`}
            >
              Mandar Correos
            </button>
            <button
              onClick={() => setMostrarVista('seguimiento')}
              className={`comentarios-btn ${mostrarVista === 'seguimiento' ? 'activo' : ''}`}
            >
              Seguimiento
            </button>
          </div>
          <div className="scroll-container">
            {mostrarVista === 'correo' && (
              <table className="comentarios-tabla">
                <thead>
                  <tr>
                    <th>Nombre Cliente</th>
                    <th>Empresa</th>
                    <th>Correo</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.clienteId}>
                      <td>{cliente.nombreCliente}</td>
                      <td>{cliente.nombreEmpresa || 'Sin Empresa'}</td>
                      <td>{cliente.correo}</td>
                      <td>
                        <button
                          onClick={() => enviarCorreo(cliente)}
                          className="btn-cafe"
                        >
                          Mandar Correo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {mostrarVista === 'seguimiento' && (
              <table className="comentarios-tabla">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Empresa</th>
                    <th>Contacto</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Estatus</th>
                    <th>Justificación</th>
                    <th>Calificación</th>
                  </tr>
                </thead>
                <tbody>
                  {comentarios.map((comentario) => (
                    <tr key={comentario.id}>
                      <td>{comentario.nombre}</td>
                      <td>{comentario.empresa}</td>
                      <td>{comentario.contacto}</td>
                      <td>{comentario.descripcion}</td>
                      <td>{comentario.fecha}</td>
                      <td>{comentario.tipo}</td>
                      <td>
                        <select
                          value={comentario.estatus}
                          onChange={(e) => cambiarEstatus(
                            comentario.id,
                            e.target.value
                          )}
                        >
                          <option value="Solicitud">Solicitud</option>
                          <option value="Procesando">Procesando</option>
                          <option value="Finalizado">Finalizado</option>
                        </select>
                      </td>
                      <td>{comentario.justificacion}</td>
                      <td>{'⭐'.repeat(comentario.calificacion)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComentariosXClientes;
