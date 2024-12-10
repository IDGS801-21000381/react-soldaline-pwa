import React, { useState, useEffect } from "react";
import Sidebar from "../components/Siderbar";

const MarketingModule = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
  const [nombrePromocion, setNombrePromocion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [linkImagen, setLinkImagen] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [promocionCreada, setPromocionCreada] = useState(false);

  const API_URL =
    "https://bazar20241109230927.azurewebsites.net/api/Usuario/getAllEmpleados";

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const clientesFiltrados = data.filter(
        (empleado) => empleado.rol === "cliente"
      );
      setClientes(clientesFiltrados);
      setClientesFiltrados(clientesFiltrados);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      alert("No se pudieron cargar los datos.");
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setClientesFiltrados(
      clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(term) ||
          cliente.direccion.toLowerCase().includes(term) ||
          cliente.correo.toLowerCase().includes(term)
      )
    );
  };

  const seleccionarCliente = (clienteId) => {
    setClientesSeleccionados((prevSeleccionados) => {
      if (prevSeleccionados.includes(clienteId)) {
        return prevSeleccionados.filter((id) => id !== clienteId);
      } else {
        return [...prevSeleccionados, clienteId];
      }
    });
  };

  const enviarCorreos = async () => {
    if (!nombrePromocion || !descripcion) {
      alert("Por favor completa todos los campos de la promoción.");
      return;
    }

    const destinatarios = clientesSeleccionados.length
      ? clientesSeleccionados.map((id) =>
          clientes.find((c) => c.id === id).correo
        )
      : clientes.map((c) => c.correo);

    const emailData = {
      to: destinatarios,
      subject: nombrePromocion,
      body: `
        <h1>${nombrePromocion}</h1>
        <p>${descripcion}</p>
        <img src="${linkImagen}" alt="Imagen de la promoción" />
        <p><strong>Válido hasta: ${fechaVencimiento}</strong></p>
      `,
    };

    try {
      const response = await fetch("https://localhost:7233/api/Email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        alert("Correos enviados exitosamente.");
      } else {
        const error = await response.json();
        alert(`No se pudieron enviar los correos: ${error.error}`);
      }
    } catch (error) {
      console.error("Error al enviar correos:", error);
      alert("Ocurrió un error al enviar los correos.");
    }
  };

  const enviarPromocion = () => {
    if (clientesSeleccionados.length === 0) {
      alert("No se han seleccionado clientes.");
      return;
    }

    if (window.confirm("¿Deseas enviar esta promoción a los clientes seleccionados?")) {
      enviarCorreos();
    }
  };

  const enviarPromocionATodos = () => {
    if (window.confirm("¿Deseas enviar esta promoción a todos los clientes?")) {
      enviarCorreos();
    }
  };

  return (
    <div className="marketing-container">
      <Sidebar />
      <div className="marketing-content">
        {promocionCreada ? (
          <>
            <h1>Seleccionar Clientes</h1>
            <input
              type="text"
              placeholder="Buscar cliente"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Dirección</th>
                    <th>Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.correo}</td>
                      <td>{cliente.direccion}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={clientesSeleccionados.includes(cliente.id)}
                          onChange={() => seleccionarCliente(cliente.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={enviarPromocionATodos}>Enviar a Todos</button>
            <button onClick={enviarPromocion}>
              Enviar a Seleccionados ({clientesSeleccionados.length})
            </button>
          </>
        ) : (
          <>
            <h1>Crear Promoción</h1>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nombre de la promoción"
                value={nombrePromocion}
                onChange={(e) => setNombrePromocion(e.target.value)}
              />
              <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              <input
                type="text"
                placeholder="Link de la imagen"
                value={linkImagen}
                onChange={(e) => setLinkImagen(e.target.value)}
              />
              <input
                type="text"
                placeholder="Fecha de vencimiento"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
              />
            </div>
            <button onClick={() => setPromocionCreada(true)}>
              Crear Promoción
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketingModule;
