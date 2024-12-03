import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Siderbar";
import "../style/Empleado.css";

const Empleado = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  // Fetch data from API
  useEffect(() => {
    axios
      .get("http://localhost:5055/api/EmpresaCliente/vista")
      .then((response) => {
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredEmployees(
      employees.filter((employee) =>
        employee.NombreCliente.toLowerCase().includes(term)
      )
    );
    setCurrentPage(1);
  };

  // Handle "Detalles" button
  const handleDetails = (id) => {
    axios
      .get(`http://localhost:5055/api/EmpresaCliente/detalles/${id}`)
      .then((response) => {
        setSelectedEmployee(response.data);
        setIsModalOpen(true);
      })
      .catch((error) => console.error("Error fetching details:", error));
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  return (
    <div className="empleado-container">
      <Sidebar />
      <div className="empleado-content">
        <h1>Catálogo de Empleados</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Empresa</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee.EmpresaId}>
                  <td>{employee.NombreCliente}</td>
                  <td>{employee.NombreEmpresa}</td>
                  <td>{employee.Correo}</td>
                  <td>{employee.Direccion}</td>
                  <td>{employee.Estatus}</td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => handleDetails(employee.ClienteId)}
                    >
                      Detalles
                    </button>
                  </td>
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
        {isModalOpen && selectedEmployee && (
          <div className="modal">
            <div className="modal-content">
              <h2>Detalles del Empleado</h2>
              <pre>{JSON.stringify(selectedEmployee, null, 2)}</pre>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Empleado;
