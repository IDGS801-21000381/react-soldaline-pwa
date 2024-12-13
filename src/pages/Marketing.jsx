import React, { useEffect, useState } from "react";
import Sidebar from "../components/Siderbar";
import { Card, Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import "../style/Marketing.css";

const Marketing = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState("");
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [promoDetails, setPromoDetails] = useState({
    descripcion: "",
  });

  // Cargar clientes desde la API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(
          "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista"
        );
        setClientes(response.data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudieron cargar los datos de los clientes.", "error");
      }
    };

    fetchClientes();
  }, []);

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(
          "https://bazar20241109230927.azurewebsites.net/api/Productos"
        );
        setProductos(response.data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudieron cargar los productos.", "error");
      }
    };

    fetchProductos();
  }, []);

  // Manejar selección de clientes
  const handleClienteSelect = (clienteId) => {
    setSelectedClientes((prev) =>
      prev.includes(clienteId) ? prev.filter((id) => id !== clienteId) : [...prev, clienteId]
    );
  };

  // Enviar correos de promoción
  const handleSendPromo = async () => {
    if (!selectedProductoId || !promoDetails.descripcion || selectedClientes.length === 0) {
      Swal.fire("Error", "Completa los detalles y selecciona al menos un cliente.", "error");
      return;
    }

    const productoSeleccionado = productos.find((producto) => producto.id === parseInt(selectedProductoId));
    const selectedEmails = clientes
      .filter((cliente) => selectedClientes.includes(cliente.clienteId))
      .map((cliente) => cliente.correo.trim());

    const selectNombre = clientes
      .filter((cliente) => selectedClientes.includes(cliente.clienteId))
      .map((cliente) => cliente.nombreCliente.trim());

    const emailRequest = {
      to: selectedEmails.join(","),
      subject: `Promoción: ${productoSeleccionado.nombreProducto}`,
      productName: productoSeleccionado.nombreProducto,
      productImage: productoSeleccionado.imagenProducto,
      description: promoDetails.descripcion,
      ClientName: selectNombre.join(","),
    };

    try {
      await axios.post("https://bazar20241109230927.azurewebsites.net/api/email/sendPromotion", emailRequest);
      Swal.fire("Éxito", "Promoción enviada exitosamente.", "success");
      setSelectedClientes([]);
      setSelectedProductoId("");
      setPromoDetails({ descripcion: "" });
    } catch (error) {
      Swal.fire("Error", error.response?.data || "No se pudo enviar la promoción.", "error");
    }
  };

  return (
    <div className="marketing-layout">
      <Sidebar />
      <div className="marketing-container">
        <Card className="marketing-card">
          <Card.Body>
            <Card.Title>Promociones de Marketing</Card.Title>

            {/* Selector de Producto */}
            <div className="promo-input-box">
              <label className="label">Producto:</label>
              <select
                value={selectedProductoId}
                onChange={(e) => setSelectedProductoId(e.target.value)}
                className="promo-select"
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombreProducto}
                  </option>
                ))}
              </select>
            </div>

            {/* Detalles de la promoción */}
            <div className="promo-input-box">
              <label className="label">Descripción:</label>
              <textarea
                value={promoDetails.descripcion}
                onChange={(e) => setPromoDetails({ descripcion: e.target.value })}
                placeholder="Descripción de la promoción"
                className="promo-textarea"
              />
            </div>

            {/* Tabla de clientes */}
            <div className="promo-client-table">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Seleccionar</th>
                    <th>Nombre del Cliente</th>
                    <th>Nombre de la Empresa</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.clienteId}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedClientes.includes(cliente.clienteId)}
                          onChange={() => handleClienteSelect(cliente.clienteId)}
                        />
                      </td>
                      <td>{cliente.nombreCliente}</td>
                      <td>{cliente.nombreEmpresa}</td>
                      <td>{cliente.correo}</td>
                      <td>{cliente.telefono}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Botón para enviar la promoción */}
            <Button
              className="promo-btn"
              onClick={handleSendPromo}
              disabled={selectedClientes.length === 0 || !selectedProductoId || !promoDetails.descripcion}
            >
              Enviar Promoción
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Marketing;
