import React, { useState, useEffect } from "react";
import Sidebar from "../components/Siderbar";


const EcommerceClients = () => {
  const [clients, setClients] = useState([]); // Datos de clientes
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Cargar datos desde un archivo JSON
  useEffect(() => {
    fetch("/data/marketing.json") // Cambia a la ruta relativa al servidor
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        const clientsData = data.clientEcommers.map((client) => ({
          id: client.Id,
          nombreUsuario: client.Nombre,
          nombres: client.Nombres,
          apellidoP: client.ApellidoP,
          apellidoM: client.ApellidoM,
          correo: client.Correo,
          direccion: client.Direccion,
          tarjeta: client.Tarjeta,
          urlImagen: client.UrlImage,
        }));
        setClients(clientsData);
        setFilteredClients(clientsData);
      })
      .catch((error) => console.error("Error cargando datos:", error));
  }, []);

  // Manejar búsqueda
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredClients(
      clients.filter(
        (client) =>
          client.nombreUsuario.toLowerCase().includes(term) ||
          client.nombres.toLowerCase().includes(term) ||
          client.apellidoP.toLowerCase().includes(term)
      )
    );
    setCurrentPage(1);
  };

  // Lógica de paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  return (
    <div className="marketing-container">
      <Sidebar />
      <div className="marketing-content">
        <h1>Clientes de Ecommerce</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar cliente por nombre, usuario o apellido"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th>Tarjeta</th>
                <th>Imagen</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.nombreUsuario}</td>
                  <td>
                    {client.nombres} {client.apellidoP} {client.apellidoM}
                  </td>
                  <td>{client.correo}</td>
                  <td>{client.direccion}</td>
                  <td>{client.tarjeta}</td>
                  <td>
                    <img
                      src={client.urlImagen}
                      alt={`Imagen de ${client.nombreUsuario}`}
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
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
      </div>
    </div>
  );
};

export default EcommerceClients;
