import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../components/Siderbar';
import "../style/Marketing.css";

const ComentariosXClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [mostrarTabla, setMostrarTabla] = useState('correo');

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
          return {
            id: item.id,
            nombre: parts[0] || item.descripcion,
            empresa: parts[1] || '',
            contacto: parts[2] || '',
            descripcion: parts[3] || item.descripcion,
            fecha: item.fecha,
            tipo: item.tipo === 1 ? 'Queja' : item.tipo === 2 ? 'Comentario' : 'Solicitud de devolución',
            estatus: item.estatus === 0 ? 'Solicitud' : item.estatus === 1 ? 'Procesando' : 'Finalizado',
            calificacion: item.calificacion,
          };
        });
        setComentarios(formattedData);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudieron cargar los datos de los comentarios.", "error");
      }
    };

    fetchComentarios();
  }, []);

  // Cambiar estatus
  const cambiarEstatus = async (id, nuevoEstatus) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `El estatus se cambiará a ${nuevoEstatus === 1 ? 'Procesando' : 'Finalizado'}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `https://bazar20241109230927.azurewebsites.net/api/ComentariosCliente/updateStatus/?id=${id}&status=${nuevoEstatus}`
          );
          setComentarios((prevComentarios) =>
            prevComentarios.map((comentario) =>
              comentario.id === id
                ? { ...comentario, estatus: nuevoEstatus === 1 ? 'Procesando' : 'Finalizado' }
                : comentario
            )
          );
          Swal.fire('¡Actualizado!', 'El estatus se ha cambiado correctamente.', 'success');
        } catch (error) {
          console.error(error);
          Swal.fire('Error', 'No se pudo cambiar el estatus.', 'error');
        }
      }
    });
  };

  return (
    <div className="comentarios-layout">
      <Sidebar />
      <div className="comentarios-container">
        <div className="comentarios-card">
          <h2>Comentarios por Clientes</h2>
          <div className="comentarios-botones">
            <button onClick={() => setMostrarTabla('correo')} className="comentarios-btn">Mandar Correo</button>
            <button onClick={() => setMostrarTabla('detalles')} className="comentarios-btn">Mostrar Detalles</button>
          </div>
          {mostrarTabla === 'correo' && (
            <div>
              <table className="comentarios-tabla">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Empresa</th>
                    <th>Acción</th>a
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className={localData.includes(cliente.id) ? 'enviado' : ''}>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.empresa}</td>
                      <td>
                        <button
                          onClick={() => {
                            setLocalData((prev) => [...prev, cliente.id]);
                            Swal.fire('Enviado', 'Correo enviado correctamente.', 'success');
                          }}
                          disabled={localData.includes(cliente.id)}
                        >
                          Mandar Correo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {mostrarTabla === 'detalles' && (
            <div>
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
                          onChange={(e) => cambiarEstatus(comentario.id, e.target.value === 'Procesando' ? 1 : 2)}
                        >
                          <option value="Solicitud">Solicitud</option>
                          <option value="Procesando">Procesando</option>
                          <option value="Finalizado">Finalizado</option>
                        </select>
                      </td>
                      <td>{'⭐'.repeat(comentario.calificacion)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComentariosXClientes;