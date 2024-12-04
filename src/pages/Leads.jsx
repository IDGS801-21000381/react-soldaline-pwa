import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../components/Siderbar";
import "../style/Leads.css";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombreCliente: "",
    direccionCliente: "",
    telefonoCliente: "",
    correoCliente: "",
    nombreEmpresa: "",
    direccionEmpresa: "",
    telefonoEmpresa: "",
    correoEmpresa: "",
    sitioWeb: "",
  });

  // Cargar datos desde localStorage o archivo JSON
  useEffect(() => {
    const fetchData = async () => {
      const storedLeads = localStorage.getItem("leads");
      if (storedLeads) {
        const parsedLeads = JSON.parse(storedLeads);
        setLeads(parsedLeads);
        setFilteredLeads(parsedLeads);
      } else {
        try {
          const response = await fetch("/data/clientes.json");
          if (response.ok) {
            const json = await response.json();
            setLeads(json);
            setFilteredLeads(json);
          } else {
            console.error("Error al cargar datos del archivo JSON");
          }
        } catch (error) {
          console.error("Error al cargar datos:", error);
        }
      }
    };

    fetchData();
  }, []);

  // Guardar en localStorage
  const saveToLocalStorage = (updatedLeads) => {
    localStorage.setItem("leads", JSON.stringify(updatedLeads));
    setLeads(updatedLeads);
    setFilteredLeads(updatedLeads);
  };

  // Filtrar y buscar
  const handleSearchAndFilter = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (lead) => lead.estatus === (filterStatus === "active" ? 1 : 0)
      );
    }

    setFilteredLeads(filtered);
  };

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, filterStatus, leads]);

  // Cambiar estatus
  const handleChangeStatus = (id) => {
    const updatedLeads = leads.map((lead) =>
      lead.clienteId === id ? { ...lead, estatus: lead.estatus === 1 ? 0 : 1 } : lead
    );
    saveToLocalStorage(updatedLeads);
    Swal.fire("Éxito", "Estatus cambiado correctamente.", "success");
  };

  // Ver detalles
  const handleViewDetails = (id) => {
    const lead = leads.find((lead) => lead.clienteId === id);
    if (lead) {
      Swal.fire({
        title: `${lead.nombreCliente}`,
        html: `
          <div style="text-align: left;">
            <p><strong>Dirección:</strong> ${lead.direccionCliente}</p>
            <p><strong>Teléfono:</strong> ${lead.telefonoCliente}</p>
            <p><strong>Correo:</strong> ${lead.correoCliente}</p>
            <p><strong>Empresa:</strong> ${lead.nombreEmpresa}</p>
            <p><strong>Sitio Web:</strong> <a href="${lead.sitioWeb}" target="_blank">${lead.sitioWeb}</a></p>
          </div>
        `,
        icon: "info",
        confirmButtonText: "Cerrar",
      });
    }
  };

  // Agregar cliente
  const handleAddClient = () => {
    const requiredFields = [
      "nombreCliente",
      "direccionCliente",
      "telefonoCliente",
      "correoCliente",
      "nombreEmpresa",
      "direccionEmpresa",
      "telefonoEmpresa",
      "correoEmpresa",
    ];
    const isValid = requiredFields.every((field) => formData[field].trim() !== "");

    if (!isValid) {
      Swal.fire("Error", "Por favor llena todos los campos obligatorios.", "error");
      return;
    }

    Swal.fire({
      title: "Confirmación",
      text: "¿Estás seguro de registrar este cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const newClient = {
          ...formData,
          clienteId: leads.length + 1,
          estatus: 1,
        };

        const updatedLeads = [...leads, newClient];
        saveToLocalStorage(updatedLeads);
        setShowForm(false);
        Swal.fire("Éxito", "Cliente registrado correctamente.", "success");
      }
    });
  };

  return (
    <div className="leads-layout">
      <Sidebar />
      <div className="leads-card-container">
        {!showForm ? (
          <div className="leads-card">
            <header className="leads-header">
              <h1>Clientes Potenciales</h1>
            </header>
            {/* <div className="leads-search">
              <input
                type="text"
                placeholder="Buscar cliente o empresa"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="search-icon fas fa-search"></i>
            </div> */}
            <div className="leads-filters">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="custom-select"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
            <button
              className="leads-register-btn"
              onClick={() => setShowForm(true)}
            >
              Registrar Cliente
            </button>
            <div className="leads-list">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.clienteId}
                  className={`lead-card ${
                    lead.estatus === 1 ? "active" : "inactive"
                  }`}
                >
                  <h2>{lead.nombreCliente}</h2>
                  <p>{lead.nombreEmpresa}</p>
                  <p>{lead.correoCliente}</p>
                  <div className="lead-actions">
                    <button
                      className="btn-change-status"
                      onClick={() => handleChangeStatus(lead.clienteId)}
                    >
                      Cambiar Estatus
                    </button>
                    <button
                      className="btn-details"
                      onClick={() => handleViewDetails(lead.clienteId)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="form-container">
            <h3>Registrar Nuevo Cliente</h3>
            {Object.keys(formData).map((key) => (
              <input
                key={key}
                type={key.includes("correo") ? "email" : "text"}
                placeholder={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
              />
            ))}
            <div className="form-buttons">
              <button onClick={handleAddClient}>Registrar</button>
              <button onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
