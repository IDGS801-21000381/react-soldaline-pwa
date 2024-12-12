import React, { useState, useEffect } from "react";
import Sidebar from "../components/Siderbar";
import "../style/Empresa.css";
import Swal from "sweetalert2";

const Empresa = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    sitioWeb: "",
  });

  const itemsPerPage = 10;

  const fetchCompanies = () => {
    fetch(
      "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/empresas"
    )
      .then((response) => response.json())
      .then((data) => {
        setCompanies(data);
        setFilteredCompanies(data);
      })
      .catch((error) => console.error("Error al cargar empresas:", error));
  };

  useEffect(() => {
    fetchCompanies();
    const interval = setInterval(fetchCompanies, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCompanies(
      companies.filter((company) =>
        company.nombre.toLowerCase().includes(term)
      )
    );
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      !newCompany.nombre ||
      !newCompany.direccion ||
      !newCompany.telefono ||
      !newCompany.correo
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos obligatorios.",
        confirmButtonColor: "#9d743f",
      });
      return;
    }

    fetch(
      "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/registerempresa",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCompany,
          sitioWeb: newCompany.sitioWeb || "N/A",
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.text(); // Cambia a .text() para manejar texto plano
      })
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "La empresa se registró correctamente.",
          confirmButtonColor: "#9d743f",
        }).then(() => {
          setShowForm(false);
          setNewCompany({
            nombre: "",
            direccion: "",
            telefono: "",
            correo: "",
            sitioWeb: "",
          });
          fetchCompanies(); // Actualiza la tabla con los datos más recientes
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text: "Hubo un problema al registrar la empresa.",
          confirmButtonColor: "#9d743f",
        });
      });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar className="sidebar" />
      <div className="dashboard-content">
        <div className="card">
          <h1 className="card-title">Catálogo de Empresas</h1>
          <div className="filters">
            <input
              type="text"
              className="filter-button"
              placeholder="Buscar por nombre de empresa"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="filter-button selected"
              onClick={() => setShowForm(true)}
            >
              Agregar Empresa
            </button>
          </div>
          {showForm ? (
            <div className="form-container">
              <form onSubmit={handleFormSubmit} className="form">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newCompany.nombre}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, nombre: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={newCompany.direccion}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, direccion: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={newCompany.telefono}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, telefono: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Correo"
                  value={newCompany.correo}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, correo: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Sitio Web"
                  value={newCompany.sitioWeb}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, sitioWeb: e.target.value })
                  }
                />
                <div className="form-buttons">
                  <button type="submit" className="btn-submit">
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Sitio Web</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCompanies.map((company, index) => (
                    <tr key={index}>
                      <td>{startIndex + index + 1}</td>
                      <td>{company.nombre}</td>
                      <td>{company.direccion}</td>
                      <td>{company.telefono}</td>
                      <td>{company.correo}</td>
                      <td>{company.sitioWeb || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={currentPage === index + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Empresa;
