import React, { useState, useEffect } from "react";
import Sidebar from "../components/Siderbar"; // Ajusta esta ruta según tu proyecto
import "../style/Leads.css"; // Asegúrate de tener este archivo
import Swal from "sweetalert2";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Cargar datos desde JSON
  useEffect(() => {
    // Simular llamada a API o archivo JSON
    const fetchLeads = async () => {
      const data = [
        {
          clienteId: 1,
          nombreCliente: "Antonio Mendoza",
          direccionCliente: "Calle 1, Piso 2",
          telefonoCliente: "555-0123",
          correoCliente: "antonio.mendoza@mail.com",
          nombreEmpresa: "Innovar Tech",
          direccionEmpresa: "Avenida del Sol 45",
          telefonoEmpresa: "555-1001",
          correoEmpresa: "contacto@innovartech.com",
          sitioWeb: "www.innovartech.com",
          estatus: 1,
        },
         {
    "clienteId": 2,
    "nombreCliente": "Isabella Ríos",
    "direccionCliente": "Calle 2, Edificio B",
    "telefonoCliente": "555-0124",
    "correoCliente": "isabella.rios@mail.com",
    "nombreEmpresa": "EcoSolutions",
    "direccionEmpresa": "Calle Verde 21",
    "telefonoEmpresa": "555-1002",
    "correoEmpresa": "info@ecosolutions.com",
    "sitioWeb": "www.ecosolutions.com",
    "estatus": 0
  },
  {
    "clienteId": 3,
    "nombreCliente": "Carlos Herrera",
    "direccionCliente": "Calle 3, Dep. 3",
    "telefonoCliente": "555-0125",
    "correoCliente": "carlos.herrera@mail.com",
    "nombreEmpresa": "Global Dynamics",
    "direccionEmpresa": "Avenida Libertad 58",
    "telefonoEmpresa": "555-1003",
    "correoEmpresa": "contact@globaldynamics.com",
    "sitioWeb": "www.globaldynamics.com",
    "estatus": 1
  },
  {
    "clienteId": 4,
    "nombreCliente": "Marta Sánchez",
    "direccionCliente": "Calle 4, Bloque A",
    "telefonoCliente": "555-0126",
    "correoCliente": "marta.sanchez@mail.com",
    "nombreEmpresa": "TechnoWorks",
    "direccionEmpresa": "Calle Industrial 12",
    "telefonoEmpresa": "555-1004",
    "correoEmpresa": "support@technoworks.com",
    "sitioWeb": "www.technoworks.com",
    "estatus": 0
  },
  {
    "clienteId": 5,
    "nombreCliente": "David Torres",
    "direccionCliente": "Calle 5, Apt 7",
    "telefonoCliente": "555-0127",
    "correoCliente": "david.torres@mail.com",
    "nombreEmpresa": "Solutions Unlimited",
    "direccionEmpresa": "Avenida Sur 73",
    "telefonoEmpresa": "555-1005",
    "correoEmpresa": "solutions@unlimited.com",
    "sitioWeb": "www.solutionsunlimited.com",
    "estatus": 1
  },
  {
    "clienteId": 6,
    "nombreCliente": "Lucía Fernández",
    "direccionCliente": "Calle 6, Dep. 1",
    "telefonoCliente": "555-0128",
    "correoCliente": "lucia.fernandez@mail.com",
    "nombreEmpresa": "Market Insights",
    "direccionEmpresa": "Calle Comercio 15",
    "telefonoEmpresa": "555-1006",
    "correoEmpresa": "contact@marketinsights.com",
    "sitioWeb": "www.marketinsights.com",
    "estatus": 0
  },
  {
    "clienteId": 7,
    "nombreCliente": "José Martínez",
    "direccionCliente": "Calle 7, Piso 1",
    "telefonoCliente": "555-0129",
    "correoCliente": "jose.martinez@mail.com",
    "nombreEmpresa": "TechVision",
    "direccionEmpresa": "Avenida Central 34",
    "telefonoEmpresa": "555-1007",
    "correoEmpresa": "info@techvision.com",
    "sitioWeb": "www.techvision.com",
    "estatus": 1
  },
  {
    "clienteId": 8,
    "nombreCliente": "Sofía Gómez",
    "direccionCliente": "Calle 8, Blv. Norte",
    "telefonoCliente": "555-0130",
    "correoCliente": "sofia.gomez@mail.com",
    "nombreEmpresa": "Financiera Horizonte",
    "direccionEmpresa": "Calle 19, Oficina 10",
    "telefonoEmpresa": "555-1008",
    "correoEmpresa": "contacto@financierahorizonte.com",
    "sitioWeb": "www.financierahorizonte.com",
    "estatus": 0
  },
  {
    "clienteId": 9,
    "nombreCliente": "Raúl Pérez",
    "direccionCliente": "Calle 9, Apt 5",
    "telefonoCliente": "555-0131",
    "correoCliente": "raul.perez@mail.com",
    "nombreEmpresa": "GreenTech",
    "direccionEmpresa": "Avenida Natura 9",
    "telefonoEmpresa": "555-1009",
    "correoEmpresa": "contact@greentech.com",
    "sitioWeb": "www.greentech.com",
    "estatus": 1
  },
  {
    "clienteId": 10,
    "nombreCliente": "María López",
    "direccionCliente": "Calle 10, Bloque C",
    "telefonoCliente": "555-0132",
    "correoCliente": "maria.lopez@mail.com",
    "nombreEmpresa": "Vanguard Solutions",
    "direccionEmpresa": "Avenida Libertador 44",
    "telefonoEmpresa": "555-1010",
    "correoEmpresa": "contact@vanguardsolutions.com",
    "sitioWeb": "www.vanguardsolutions.com",
    "estatus": 0
  },
  {
    "clienteId": 11,
    "nombreCliente": "Fernando Castillo",
    "direccionCliente": "Calle 11, Piso 3",
    "telefonoCliente": "555-0133",
    "correoCliente": "fernando.castillo@mail.com",
    "nombreEmpresa": "Global Networks",
    "direccionEmpresa": "Avenida Internacional 23",
    "telefonoEmpresa": "555-1011",
    "correoEmpresa": "info@globalnetworks.com",
    "sitioWeb": "www.globalnetworks.com",
    "estatus": 1
  },
  {
    "clienteId": 12,
    "nombreCliente": "Esteban Díaz",
    "direccionCliente": "Calle 12, Edificio 4",
    "telefonoCliente": "555-0134",
    "correoCliente": "esteban.diaz@mail.com",
    "nombreEmpresa": "Sistemas Avanzados",
    "direccionEmpresa": "Avenida Innovación 19",
    "telefonoEmpresa": "555-1012",
    "correoEmpresa": "contact@sistemasavanzados.com",
    "sitioWeb": "www.sistemasavanzados.com",
    "estatus": 0
  },
  {
    "clienteId": 13,
    "nombreCliente": "Gabriela Martínez",
    "direccionCliente": "Calle 13, Piso 1",
    "telefonoCliente": "555-0135",
    "correoCliente": "gabriela.martinez@mail.com",
    "nombreEmpresa": "TechVentures",
    "direccionEmpresa": "Avenida Sur 56",
    "telefonoEmpresa": "555-1013",
    "correoEmpresa": "info@techventures.com",
    "sitioWeb": "www.techventures.com",
    "estatus": 1
  },
  {
    "clienteId": 14,
    "nombreCliente": "Ricardo Sánchez",
    "direccionCliente": "Calle 14, Dep. 2",
    "telefonoCliente": "555-0136",
    "correoCliente": "ricardo.sanchez@mail.com",
    "nombreEmpresa": "Redes Globales",
    "direccionEmpresa": "Avenida Principal 87",
    "telefonoEmpresa": "555-1014",
    "correoEmpresa": "contact@redesglobales.com",
    "sitioWeb": "www.redesglobales.com",
    "estatus": 0
  },
  {
    "clienteId": 15,
    "nombreCliente": "Cecilia Gómez",
    "direccionCliente": "Calle 15, Edificio 1",
    "telefonoCliente": "555-0137",
    "correoCliente": "cecilia.gomez@mail.com",
    "nombreEmpresa": "Biotech Innovations",
    "direccionEmpresa": "Avenida Ciencia 40",
    "telefonoEmpresa": "555-1015",
    "correoEmpresa": "contact@biotechinnovations.com",
    "sitioWeb": "www.biotechinnovations.com",
    "estatus": 1
  },
  {
    "clienteId": 16,
    "nombreCliente": "Diego Ramírez",
    "direccionCliente": "Calle 16, Piso 3",
    "telefonoCliente": "555-0138",
    "correoCliente": "diego.ramirez@mail.com",
    "nombreEmpresa": "Quantum Systems",
    "direccionEmpresa": "Calle Tecnológica 22",
    "telefonoEmpresa": "555-1016",
    "correoEmpresa": "contact@quantumsystems.com",
    "sitioWeb": "www.quantumsystems.com",
    "estatus": 0
  },
  {
    "clienteId": 17,
    "nombreCliente": "Clara Silva",
    "direccionCliente": "Calle 17, Piso 2",
    "telefonoCliente": "555-0139",
    "correoCliente": "clara.silva@mail.com",
    "nombreEmpresa": "Evolución Creativa",
    "direccionEmpresa": "Avenida Progreso 18",
    "telefonoEmpresa": "555-1017",
    "correoEmpresa": "info@evolucioncreativa.com",
    "sitioWeb": "www.evolucioncreativa.com",
    "estatus": 1
  },
  {
    "clienteId": 18,
    "nombreCliente": "Martín López",
    "direccionCliente": "Calle 18, Apt 4",
    "telefonoCliente": "555-0140",
    "correoCliente": "martin.lopez@mail.com",
    "nombreEmpresa": "Data Solutions",
    "direccionEmpresa": "Avenida Central 90",
    "telefonoEmpresa": "555-1018",
    "correoEmpresa": "contact@databusiness.com",
    "sitioWeb": "www.databusiness.com",
    "estatus": 0
  },
  {
    "clienteId": 19,
    "nombreCliente": "Patricia Vargas",
    "direccionCliente": "Calle 19, Piso 5",
    "telefonoCliente": "555-0141",
    "correoCliente": "patricia.vargas@mail.com",
    "nombreEmpresa": "Green Innovations",
    "direccionEmpresa": "Calle Ecológica 15",
    "telefonoEmpresa": "555-1019",
    "correoEmpresa": "info@greeninnovations.com",
    "sitioWeb": "www.greeninnovations.com",
    "estatus": 1
  },
  {
    "clienteId": 20,
    "nombreCliente": "Luis Pérez",
    "direccionCliente": "Calle 20, Piso 2",
    "telefonoCliente": "555-0142",
    "correoCliente": "luis.perez@mail.com",
    "nombreEmpresa": "Red Digital",
    "direccionEmpresa": "Avenida Digital 44",
    "telefonoEmpresa": "555-1020",
    "correoEmpresa": "contact@reddigital.com",
    "sitioWeb": "www.reddigital.com",
    "estatus": 0
  }
      ];
      setLeads(data);
      setFilteredLeads(data);
    };

    fetchLeads();
  }, []);

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
  const handleChangeStatus = (id, currentStatus) => {
    const updatedLeads = leads.map((lead) =>
      lead.clienteId === id ? { ...lead, estatus: currentStatus === 1 ? 0 : 1 } : lead
    );
    setLeads(updatedLeads);
    setFilteredLeads(updatedLeads);
    Swal.fire("Éxito", "Estatus cambiado correctamente.", "success");
  };

  // Mostrar detalles del lead
  const handleViewDetails = (id) => {
    const lead = leads.find((lead) => lead.clienteId === id);
    if (lead) {
      let detalles = `Cliente:\nNombre: ${lead.nombreCliente}\nDirección: ${lead.direccionCliente}\nTeléfono: ${lead.telefonoCliente}\nCorreo: ${lead.correoCliente}\nEstatus: ${lead.estatus === 1 ? "Activo" : "Inactivo"}`;

      detalles += `\n\nEmpresa:\nNombre: ${lead.nombreEmpresa}\nDirección: ${lead.direccionEmpresa}\nTeléfono: ${lead.telefonoEmpresa}\nCorreo: ${lead.correoEmpresa}\nSitio Web: ${lead.sitioWeb}`;

      Swal.fire("Detalles del Cliente", detalles, "info");
    }
  };

  return (
    <div className="leads-layout">
      <Sidebar />
      <div className="leads-card-container">
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
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <div
                  key={lead.clienteId}
                  className={`lead-card ${lead.estatus === 1 ? "active" : "inactive"}`}
                >
                  <h2>{lead.nombreCliente}</h2>
                  <h3>{lead.nombreEmpresa}</h3>
                  <p>Correo: {lead.correoCliente}</p>
                  <p>Teléfono: {lead.telefonoCliente}</p>
                  <p className="lead-status">
                    Estatus: {lead.estatus === 1 ? "Activo" : "Inactivo"}
                  </p>
                  <div className="lead-actions">
                    <button
                      className="btn-change-status"
                      onClick={() => handleChangeStatus(lead.clienteId, lead.estatus)}
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
      </div>
    </div>
  );
};

export default Leads;
