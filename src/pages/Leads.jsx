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
  const [showForm, setShowForm] = useState(false); // Controlar la visibilidad del formulario
  const [formData, setFormData] = useState({
    nombreCliente: "",
    direccionCliente: "",
    telefonoCliente: "",
    correoCliente: "",
    redesSociales: "",
    origen: "",
    preferenciaComunicacion: "",
    nombreEmpresa: "",
    direccionEmpresa: "",
    telefonoEmpresa: "",
    correoEmpresa: "",
    sitioWeb: "",
    UsuarioId: null, // Inicialmente null
  });

  // Obtener el ID del usuario desde el localStorage
  useEffect(() => {
    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      setFormData((prevFormData) => ({
        ...prevFormData,
        UsuarioId: usuario.id, // Asignar el ID del usuario
      }));
    } else {
      Swal.fire("Error", "No se encontró información del usuario. Por favor, inicia sesión.", "error");
    }
  }, []);

  // Validar el formulario antes de enviarlo
  const validateForm = () => {
    const errors = [];
    if (!formData.nombreCliente.trim()) errors.push("El nombre del cliente es obligatorio.");
    if (!formData.direccionCliente.trim()) errors.push("La dirección del cliente es obligatoria.");
    if (!formData.telefonoCliente.match(/^\d{10}$/)) errors.push("El teléfono del cliente debe tener exactamente 10 dígitos.");
    if (!formData.correoCliente.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push("El correo electrónico del cliente no es válido.");
    if (!formData.redesSociales.trim()) errors.push("Las redes sociales del cliente son obligatorias.");
    if (!formData.origen.trim()) errors.push("El origen del cliente es obligatorio.");
    if (!formData.preferenciaComunicacion.trim()) errors.push("La preferencia de comunicación es obligatoria.");
    if (!formData.nombreEmpresa.trim()) errors.push("El nombre de la empresa es obligatorio.");
    if (!formData.direccionEmpresa.trim()) errors.push("La dirección de la empresa es obligatoria.");
    if (!formData.telefonoEmpresa.match(/^\d{10}$/)) errors.push("El teléfono de la empresa debe tener exactamente 10 dígitos.");
    if (!formData.correoEmpresa.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push("El correo electrónico de la empresa no es válido.");
    return errors;
  };

  // Registrar un nuevo cliente y empresa
  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      Swal.fire("Error", errors.join("\n"), "error");
      return;
    }

    try {
      await axios.post("http://localhost:5055/api/EmpresaCliente/register", formData);
      Swal.fire("Éxito", "Cliente registrado correctamente.", "success");
      setShowForm(false);
      fetchLeads();
    } catch (error) {
      Swal.fire("Error", "No se pudo registrar el cliente.", "error");
    }
  };

  // Cargar leads desde el endpoint /vista
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5055/api/EmpresaCliente/vista");
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error("Error al cargar los leads:", error);
      Swal.fire("Error", "No se pudo cargar la lista de clientes.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredLeads(leads);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5055/api/EmpresaCliente/buscar?searchTerm=${term}`);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error("Error al buscar leads:", error);
      setFilteredLeads([]);
      Swal.fire("Error", "No se encontraron resultados.", "error");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="leads-layout">
      <Sidebar />
      <div className="leads-card-container">
        {showForm ? (
          <div className="form-container">
            <h3>Registrar Nuevo Cliente</h3>
            <form onSubmit={handleRegister}>
              {/* Datos del Cliente */}
              <h4>Datos del Cliente</h4>
              <div className="form-group">
                <label htmlFor="nombreCliente">Nombre del Cliente</label>
                <input
                  id="nombreCliente"
                  type="text"
                  placeholder="Ej. Angel Francisco Barrientos Flores"
                  value={formData.nombreCliente}
                  onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="direccionCliente">Dirección del Cliente</label>
                <input
                  id="direccionCliente"
                  type="text"
                  placeholder="Ej. Col. Villas de San Juan, calle Cerro Gordo 119"
                  value={formData.direccionCliente}
                  onChange={(e) => setFormData({ ...formData, direccionCliente: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefonoCliente">Teléfono del Cliente</label>
                <input
                  id="telefonoCliente"
                  type="text"
                  placeholder="Ej. 4771234567"
                  value={formData.telefonoCliente}
                  onChange={(e) => setFormData({ ...formData, telefonoCliente: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="correoCliente">Correo del Cliente</label>
                <input
                  id="correoCliente"
                  type="email"
                  placeholder="Ej. cliente@example.com"
                  value={formData.correoCliente}
                  onChange={(e) => setFormData({ ...formData, correoCliente: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="redesSociales">Redes Sociales</label>
                <input
                  id="redesSociales"
                  type="text"
                  placeholder="Ej. @clienteInstagram"
                  value={formData.redesSociales}
                  onChange={(e) => setFormData({ ...formData, redesSociales: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="origen">Origen</label>
                <input
                  id="origen"
                  type="text"
                  placeholder="Ej. Referencia de un amigo"
                  value={formData.origen}
                  onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="preferenciaComunicacion">Preferencia de Comunicación</label>
                <input
                  id="preferenciaComunicacion"
                  type="text"
                  placeholder="Ej. WhatsApp, llamada telefónica"
                  value={formData.preferenciaComunicacion}
                  onChange={(e) => setFormData({ ...formData, preferenciaComunicacion: e.target.value })}
                  required
                />
              </div>

              {/* Datos de la Empresa */}
              <h4>Datos de la Empresa</h4>
              <div className="form-group">
                <label htmlFor="nombreEmpresa">Nombre de la Empresa</label>
                <input
                  id="nombreEmpresa"
                  type="text"
                  placeholder="Ej. Instituto Tepeyac"
                  value={formData.nombreEmpresa}
                  onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="direccionEmpresa">Dirección de la Empresa</label>
                <input
                  id="direccionEmpresa"
                  type="text"
                  placeholder="Ej. Avenida Principal 123"
                  value={formData.direccionEmpresa}
                  onChange={(e) => setFormData({ ...formData, direccionEmpresa: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefonoEmpresa">Teléfono de la Empresa</label>
                <input
                  id="telefonoEmpresa"
                  type="text"
                  placeholder="Ej. 4779876543"
                  value={formData.telefonoEmpresa}
                  onChange={(e) => setFormData({ ...formData, telefonoEmpresa: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="correoEmpresa">Correo de la Empresa</label>
                <input
                  id="correoEmpresa"
                  type="email"
                  placeholder="Ej. empresa@example.com"
                  value={formData.correoEmpresa}
                  onChange={(e) => setFormData({ ...formData, correoEmpresa: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="sitioWeb">Sitio Web</label>
                <input
                  id="sitioWeb"
                  type="text"
                  placeholder="Ej. www.empresa.com"
                  value={formData.sitioWeb}
                  onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="submit">Registrar</button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
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
                onChange={handleSearch}
              />
            </div>

            <button className="leads-register-btn" onClick={() => setShowForm(true)}>
              Registrar Cliente
            </button>

            <div className="leads-list">
              {loading ? (
                <div className="spinner">Cargando...</div>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead, index) => (
                  <div key={index} className={`lead-card ${lead.estatus === 1 ? "active" : "inactive"}`}>
                    <h2>{lead.nombreCliente}</h2>
                    <h3>{lead.nombreEmpresa}</h3>
                    <p>Correo: {lead.correo}</p>
                    <p>Teléfono: {lead.telefono}</p>
                    <p className="lead-status">
                      Estatus: {lead.estatus === 1 ? "Activo" : "Inactivo"}
                    </p>
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
