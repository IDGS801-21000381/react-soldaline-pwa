import React, { useState, useEffect } from "react";
import Sidebar from "../components/Siderbar";
import "../style/Empleado.css";

const Empleado = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Load data from local JSON file
  useEffect(() => {
    fetch("/data/clientes.json") // Cambia a la ruta relativa al servidor
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        const empresas = data.clientes.map((cliente) => ({
          idEmpresa: cliente.clienteId,
          nombreEmpresa: cliente.nombreEmpresa,
          direccionEmpresa: cliente.direccionEmpresa,
          correoEmpresa: cliente.correoEmpresa,
          telefonoEmpresa: cliente.telefonoEmpresa,
          sitioWeb: cliente.sitioWeb,
          estatus: cliente.estatus,
        }));
        setCompanies(empresas);
        setFilteredCompanies(empresas);
      })
      .catch((error) => console.error("Error cargando datos:", error));
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCompanies(
      companies.filter((company) =>
        company.nombreEmpresa.toLowerCase().includes(term)
      )
    );
    setCurrentPage(1);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  return (
    <div className="empleado-container">
      <Sidebar />
      <div className="empleado-content">
        <h1>Catálogo de Empresas</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre de empresa"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID Empresa</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Sitio Web</th>
                <th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCompanies.map((company) => (
                <tr key={company.idEmpresa}>
                  <td>{company.idEmpresa}</td>
                  <td>{company.nombreEmpresa}</td>
                  <td>{company.direccionEmpresa}</td>
                  <td>{company.correoEmpresa}</td>
                  <td>{company.telefonoEmpresa}</td>
                  <td>
                    <a href={`https://${company.sitioWeb}`} target="_blank" rel="noopener noreferrer">
                      {company.sitioWeb}
                    </a>
                  </td>
                  <td>{company.estatus === 1 ? "Activo" : "Inactivo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Empleado;
