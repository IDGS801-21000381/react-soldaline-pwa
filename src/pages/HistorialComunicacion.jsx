import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../components/Siderbar";
import "../style/historial.css";

const HistorialComunicacion = () => {
  const [clientes, setClientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Campos del formulario
  const [fechaComunicacion, setFechaComunicacion] = useState("");
  const [tipoComunicacion, setTipoComunicacion] = useState(1);
  const [detalles, setDetalles] = useState("");
  const [solicitud, setSolicitud] = useState("");
  const [fechaProximaCita, setFechaProximaCita] = useState("");

  useEffect(() => {
    fetchClientes();
    setFechaProximaCita(getDefaultProximaCita());
    setFechaComunicacion(getTodayDate());
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch(
        "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista"
      );
      if (!response.ok) throw new Error("Error al cargar los clientes");
      const clientesData = await response.json();
      setClientes(clientesData);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los clientes.",
      });
    }
  };

  const fetchHistorial = async (clienteId) => {
    setLoadingHistorial(true);
    setHistorial([]);
    try {
      const response = await fetch(
        `https://bazar20241109230927.azurewebsites.net/api/HistorialComunicacion/by-cliente/${clienteId}`
      );
      if (!response.ok)
        throw new Error("Error al cargar el historial de comunicación");
      const historialData = await response.json();
      setHistorial(historialData);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "Info",
        title: "No hay registros",
        text: "No cuenta con historial de comunicación con este cliente.",
      });
    } finally {
      setLoadingHistorial(false);
    }
  };

  const handleClienteChange = (clienteId) => {
    const cliente = clientes.find((c) => c.clienteId === clienteId) || null;
    setSelectedCliente(cliente);
    if (cliente) {
      fetchHistorial(clienteId);
    } else {
      setHistorial([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCliente) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor selecciona un cliente.",
      });
      return;
    }

    const payload = {
      clienteId: selectedCliente.clienteId,
      usuarioId: 4,
      fechaComunicacion,
      tipoComunicacion,
      detallesComunicado: detalles,
      fechaProximaCita,
      solicitud,
    };

    try {
      const response = await fetch(
        "https://bazar20241109230927.azurewebsites.net/api/HistorialComunicacion/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Historial de comunicación registrado.",
        });
        fetchHistorial(selectedCliente.clienteId);
        setShowForm(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo registrar el historial.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al registrar el historial.",
      });
    }
  };

  const getDefaultProximaCita = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="leads-layout">
      <Sidebar className="sidebar" />
      <div className="leads-card-container">
        <div className="leads-card">
          <header className="leads-header">
            <h1>📞 Historial de Comunicación</h1>
          </header>

          <div className="leads-search">
            <label>Seleccionar Cliente:</label>
            <select
              value={selectedCliente?.clienteId || ""}
              onChange={(e) => handleClienteChange(Number(e.target.value))}
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.clienteId} value={cliente.clienteId}>
                  {cliente.nombreCliente}
                </option>
              ))}
            </select>
          </div>

          {selectedCliente ? (
  loadingHistorial ? (
    <p>Cargando historial...</p>
  ) : historial.length > 0 ? (
    <div className="leads-list">
      {historial.map((item) => (
        <div
          key={item.historialId}
          className={`lead-card ${item.estatus === 1 ? "active" : "inactive"}`}
        >
          <p>📅 {item.fechaComunicacion}</p>
          <p>
            Tipo:{" "}
            {
              [
                "Correo",
                "Videollamada",
                "Llamada",
                "Red Social",
                "Presencial",
              ][item.tipoComunicacion - 1]
            }
          </p>
          <p>Detalles: {item.detallesComunicado}</p>
          <p>Solicitud: {item.solicitud}</p>
          <p>Próxima Cita: {item.fechaProximaCita}</p>
          <p>
            Estatus:{" "}
            <span
              style={{
                color: item.estatus === 1 ? "green" : "red",
              }}
            >
              {item.estatus === 1 ? "Activo" : "Inactivo"}
            </span>
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p>Este cliente no tiene historial de comunicación.</p>
  )
) : (
  <p>Selecciona un cliente para ver su historial.</p>
)}


          {!showForm && selectedCliente && (
            <button
              className="leads-register-btn"
              onClick={() => setShowForm(true)}
            >
              + Agregar Nuevo Historial
            </button>
          )}

          {showForm && (
            <div className="form-container">
              <h3>📝 Registrar Nuevo Historial</h3>
              <input
                type="date"
                value={fechaComunicacion}
                onChange={(e) => setFechaComunicacion(e.target.value)}
              />
              <select
                value={tipoComunicacion}
                onChange={(e) => setTipoComunicacion(Number(e.target.value))}
              >
                <option value={1}>Correo</option>
                <option value={2}>Videollamada</option>

                <option value={4}>Red Social</option>
                <option value={5}>Presencial</option>
              </select>
              <textarea
                value={detalles}
                onChange={(e) => setDetalles(e.target.value)}
                placeholder="Escribe los detalles..."
              />
              <input
                type="text"
                value={solicitud}
                onChange={(e) => setSolicitud(e.target.value)}
                placeholder="Escribe la solicitud..."
              />
              <input
                type="date"
                value={fechaProximaCita}
                onChange={(e) => setFechaProximaCita(e.target.value)}
              />
              <button onClick={handleSubmit}>Registrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialComunicacion;
