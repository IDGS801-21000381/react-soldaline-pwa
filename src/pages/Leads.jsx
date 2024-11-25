import React, { useState, useEffect } from "react";
import Sidebar from "../components/Siderbar";
import "../style/Leads.css";
import axios from "axios";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5055/api/Leads");
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      alert("Error al cargar los leads");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="leads-layout">
      <Sidebar />
      <div className="leads-card-container">
        <div className="leads-card">
          <div className="leads-header">
            <h1>Clientes Potenciales</h1>
          </div>

          {/* Barra de búsqueda */}
          <div className="leads-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar cliente o empresa"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Botón de registro */}
          <button
            className="leads-register-btn"
            onClick={() => alert("Registrar nuevo cliente")}
          >
            Registrar Cliente
          </button>

          {/* Lista de leads */}
          {loading ? (
            <div className="leads-loading">Cargando...</div>
          ) : (
            <div className="leads-list">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.ClienteId}
                  className="lead-card"
                  style={{
                    borderLeftColor: lead.estatus === 1 ? "blue" : "red",
                  }}
                >
                  <h2>{lead.nombreCliente}</h2>
                  <h3>{lead.nombreEmpresa}</h3>
                  <p>Correo: {lead.correo}</p>
                  <p>Teléfono: {lead.telefono}</p>
                  <p>Dirección: {lead.direccion}</p>
                  <p className="lead-id">ID Cliente: {lead.ClienteId}</p>
                  <p
                    className="lead-status"
                    style={{ color: lead.estatus === 1 ? "blue" : "red" }}
                  >
                    Estatus: {lead.estatus === 1 ? "Activo" : "Inactivo"}
                  </p>

                  <div className="lead-actions">
                    <button className="btn btn-deactivate">Desactivar</button>
                    <button
                      className="btn btn-details"
                      onClick={() =>
                        alert(`Detalles del cliente ${lead.ClienteId}`)
                      }
                    >
                      Detalles
                    </button>
                    <button className="btn btn-history">Historial</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leads;
