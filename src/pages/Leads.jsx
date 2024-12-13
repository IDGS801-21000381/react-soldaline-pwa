import React, { useState, useEffect } from "react";
import Sidebar from "../components/Siderbar";
import axios from "axios";
import Swal from "sweetalert2";

const Leads = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    redesSociales: "",
    origen: "",
    preferenciaComunicacion: "",
    usuarioId: 0,
    empresaId: "",
  });
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    fetchClientes();
    fetchEmpresas();
    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      setFormData((prevFormData) => ({
        ...prevFormData,
        usuarioId: usuario.id,
      }));
    }
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(
        "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista"
      );
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching clientes", error);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const response = await axios.get(
        "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/empresas"
      );
      setEmpresas(response.data);
    } catch (error) {
      console.error("Error fetching empresas", error);
    }
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    try {
      const response = await axios.get(
        `https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/buscar?searchTerm=${e.target.value}`
      );
      setClientes(response.data);
    } catch (error) {
      console.error("Error searching clientes", error);
    }
  };
const handleStatusChange = async (clienteId, currentStatus) => {
  const newStatus = currentStatus === 1 ? 2 : 1; // Alternar estatus

  Swal.fire({
    title: "¿Seguro que deseas cambiar el estatus?",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const payload = { estatusCliente: newStatus }; // Solo enviar el nuevo estatus en el cuerpo
        console.log("Datos enviados al endpoint:", payload);

        // Asegurarte de que el clienteId esté en la URL como lo espera el backend
        const response = await axios.put(
          `https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/change-status/${clienteId}`,
          payload
        );

        console.log("Respuesta del servidor:", response.data);
        fetchClientes(); // Actualizar la lista
        Swal.fire("¡Éxito!", "El estatus ha sido cambiado.", "success");
      } catch (error) {
        console.error("Error al cambiar el estatus:", error);
        Swal.fire("Error", "No se pudo cambiar el estatus.", "error");
      }
    }
  });
};


  const handleDetails = async (clienteId) => {
    try {
      const response = await axios.get(
        `https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/detalles/${clienteId}`
      );
      const { cliente, empresa } = response.data;
      Swal.fire({
        title: `Detalles de ${cliente.nombre}`,
        html: `
          <strong>Dirección:</strong> ${cliente.direccion}<br/>
          <strong>Teléfono:</strong> ${cliente.telefono}<br/>
          <strong>Correo:</strong> ${cliente.correo}<br/>
          <strong>Redes Sociales:</strong> ${cliente.redesSociales}<br/>
          <strong>Origen:</strong> ${cliente.origen}<br/>
          <strong>Preferencia de Comunicación:</strong> ${cliente.preferenciaComunicacion}<br/>
          <strong>Empresa:</strong> ${empresa ? empresa.nombre : "Sin Empresa"}<br/>
        `,
        width: 600,
      });
    } catch (error) {
      console.error("Error fetching details", error);
      Swal.fire("Error", "No se pudieron obtener los detalles del cliente.", "error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/registercliente",
        formData
      );
      fetchClientes();
      Swal.fire("¡Éxito!", "Cliente registrado correctamente.", "success");
      setShowRegisterForm(false);
    } catch (error) {
      console.error("Error registering cliente", error);
      Swal.fire("Error", "No se pudo registrar el cliente.", "error");
    }
  };

  return (
    <div className="leads-layout">
      <Sidebar />
      <div className="leads-card-container">
        {!showRegisterForm && (
          <>
            <h1 className="leads-header">Clientes Potenciales</h1>

            <div className="leads-search">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <i className="search-icon bi bi-search"></i>
            </div>

            <button
              className="leads-register-btn"
              onClick={() => setShowRegisterForm(true)}
            >
              Registrar Cliente
            </button>

            <div className="leads-list">
              {clientes.map((cliente) => (
                <div
                  key={cliente.clienteId}
                  className={`lead-card ${
                    cliente.estatus === 1 ? "active" : "inactive"
                  }`}
                >
                  <h5>{cliente.nombreCliente}</h5>
                  <p>Empresa: {cliente.nombreEmpresa || "Sin Empresa"}</p>
                  <p>Correo: {cliente.correo}</p>
                  <p>Teléfono: {cliente.telefono}</p>
                  <div className="lead-actions">
                    <button
  className="btn-change-status"
  onClick={() => handleStatusChange(cliente.clienteId, cliente.estatus)}
>
  Cambiar Estatus
</button>


                    <button
                      className="btn-details"
                      onClick={() => handleDetails(cliente.clienteId)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showRegisterForm && (
          <div className="form-container">
            <h3>Registrar Cliente</h3>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Correo"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Redes Sociales"
                value={formData.redesSociales}
                onChange={(e) =>
                  setFormData({ ...formData, redesSociales: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Origen"
                value={formData.origen}
                onChange={(e) =>
                  setFormData({ ...formData, origen: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Preferencia de Comunicación"
                value={formData.preferenciaComunicacion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferenciaComunicacion: e.target.value,
                  })
                }
              />
              <select
                value={formData.empresaId}
                onChange={(e) =>
                  setFormData({ ...formData, empresaId: e.target.value })
                }
              >
                <option value="">Seleccione una empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.empresaId} value={empresa.empresaId}>
                    {empresa.nombre}
                  </option>
                ))}
              </select>
              <button type="submit">Registrar</button>
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
