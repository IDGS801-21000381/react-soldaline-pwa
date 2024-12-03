import React, { useState, useEffect } from "react";
import Sidebar from "../components/Siderbar";
import "../style/Leads.css";
import axios from "axios";
import Swal from "sweetalert2";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombreCliente: "",
    direccionCliente: "",
    telefonoCliente: "",
    correoCliente: "",
    redesSociales: "",
    origen: "",
    preferenciaComunicacion: "",
    usuarioId: 0,
    nombreEmpresa: "",
    direccionEmpresa: "",
    telefonoEmpresa: "",
    correoEmpresa: "",
    sitioWeb: "",
  });

  // Cargar leads desde la API
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5055/api/EmpresaCliente/vista");

      // Guardar leads y filtrados
      setLeads(response.data);
      setFilteredLeads(response.data);

      // Imprimir cada lead en consola con formato adecuado
      response.data.forEach((lead) => {
        console.log(JSON.stringify(lead, null, 2));
      });
    } catch (error) {
      console.error("Error al cargar los leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar leads por texto
  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      const filtered = leads.filter(
        (lead) =>
          lead.nombreCliente.toLowerCase().includes(text.toLowerCase()) ||
          lead.nombreEmpresa.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLeads(filtered);
    } else {
      setFilteredLeads(leads);
    }
  };

  // Cambiar el estatus del lead
  const handleChangeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // Cambiar entre Activo e Inactivo
    try {
      const response = await axios.put(`http://localhost:5055/api/EmpresaCliente/change-status/${id}`, {
        estatus: newStatus,
      });
      if (response.status === 200) {
        Swal.fire("Éxito", "Estatus cambiado correctamente.", "success");
        fetchLeads(); // Recargar lista de leads
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estatus del cliente.", "error");
    }
  };

  // Obtener los detalles completos de un cliente y su empresa
  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5055/api/EmpresaCliente/detalles/${id}`);
      
      const cliente = response.data.Cliente;
      const empresa = response.data.Empresa;

      let detalles = `Cliente:\nNombre: ${cliente.Nombre}\nDirección: ${cliente.Direccion}\nTeléfono: ${cliente.Telefono}\nCorreo: ${cliente.Correo}\nEstatus: ${cliente.Estatus === 1 ? "Activo" : "Inactivo"}`;

      if (empresa) {
        detalles += `\n\nEmpresa:\nNombre: ${empresa.Nombre}\nDirección: ${empresa.Direccion}\nTeléfono: ${empresa.Telefono}\nCorreo: ${empresa.Correo}\nSitio Web: ${empresa.SitioWeb}`;
      }

      Swal.fire("Detalles del Cliente", detalles, "info");
    } catch (error) {
      Swal.fire("Error", "No se pudo obtener los detalles del cliente.", "error");
    }
  };

  // Obtener ClienteId desde LocalStorage
  const fetchClientIdFromStorage = () => {
    const storedId = localStorage.getItem("ClienteId");
    if (!storedId) {
      Swal.fire("Advertencia", "No se encontró un ClienteId en el Local Storage.", "warning");
    } else {
      console.log("ClienteId obtenido desde el Local Storage:", storedId);
    }
    return storedId;
  };

  useEffect(() => {
    fetchLeads();
    fetchClientIdFromStorage(); // Obtener ClienteId al cargar el componente
  }, []);

  return (
    <div className="leads-layout">
      <Sidebar />
      <div className="leads-card-container">
        {showForm ? (
          <div className="form-container">
            <h3>Registrar Nuevo Cliente</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await axios.post(
                    "http://localhost:5055/api/EmpresaCliente/register",
                    formData
                  );
                  Swal.fire("Éxito", "Cliente registrado correctamente.", "success");
                  setShowForm(false);
                  fetchLeads(); // Recargar la lista de leads
                } catch (error) {
                  Swal.fire("Error", "No se pudo registrar el cliente.", "error");
                }
              }}
            >
              {Object.keys(formData).map((key) => (
                <div key={key} className="form-group">
                  <label htmlFor={key}>{key.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    id={key}
                    type="text"
                    name={key}
                    placeholder={key.replace(/([A-Z])/g, " $1")}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    required
                  />
                </div>
              ))}
              <div className="form-actions">
                <button type="submit">Registrar</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)} // Ocultar formulario
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="leads-card">
            <div className="leads-header">
              <h1>Clientes Potenciales</h1>
            </div>

            <div className="leads-search">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar cliente o empresa"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <button
              className="leads-register-btn"
              onClick={() => setShowForm(true)}
            >
              Registrar Cliente
            </button>

            <div className="leads-list">
              {loading ? (
                <div className="spinner">Cargando...</div>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <div
                    key={lead.clienteId}
                    className={`lead-card ${lead.estatus === 1 ? "active" : "inactive"}`}
                  >
                    <h2>{lead.nombreCliente || <span className="placeholder">Sin Nombre</span>}</h2>
                    <h3>{lead.nombreEmpresa || <span className="placeholder">Sin Empresa</span>}</h3>
                    <p>Correo: {lead.correo || <span className="placeholder">No especificado</span>}</p>
                    <p>Teléfono: {lead.telefono || <span className="placeholder">No especificado</span>}</p>
                    <p className="lead-status">
                      Estatus: {lead.estatus === 1 ? "Activo" : "Inactivo"}
                    </p>
                    <div className="lead-actions">
                      <button
                        className="btn-change-status"
                        onClick={() => handleChangeStatus(lead.clienteId, lead.estatus)}
                        disabled={loading}
                      >
                        Cambiar Estatus
                      </button>
                      <button
                        className="btn-details"
                        onClick={() => handleViewDetails(lead.clienteId)}
                      >
                        Detalles
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">No se encontraron clientes.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
