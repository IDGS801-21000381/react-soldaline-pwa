import React, { useState } from 'react';
import Sidebar from "../components/Siderbar";
import { Card } from 'react-bootstrap'; // Para trabajar con el card de manera sencilla
import "../style/Planificacion.css";

const productosIniciales = [
  { id: 1, nombre: "Puerta de hierro", precio: 1500, cantidad: 5, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
  { id: 2, nombre: "Reja de ventana", precio: 800, cantidad: 10, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
  { id: 3, nombre: "Barandal de escalera", precio: 1200, cantidad: 8, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
  { id: 4, nombre: "Reja", precio: 1200, cantidad: 8, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
  { id: 5, nombre: "Escalera", precio: 1200, cantidad: 8, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" }
];

const Planificacion = () => {
  const [productos] = useState(productosIniciales); // Usamos los productos iniciales directamente
  const [selectedProductoId, setSelectedProductoId] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [resultado, setResultado] = useState(null);
  const [historialProduccion, setHistorialProduccion] = useState([]);

  // Función para calcular el tiempo estimado de producción
  const handleCalcularTiempo = () => {
    if (!selectedProductoId || !cantidad) {
      alert('Por favor, selecciona un producto y una cantidad.');
      return;
    }

    const productoSeleccionado = productos.find(p => p.id === parseInt(selectedProductoId));

    if (productoSeleccionado) {
      // Simulamos un cálculo de tiempo de producción (en horas)
      const tiempoEstimadoHoras = (parseInt(cantidad) * 2); // Por ejemplo, cada unidad tarda 2 horas
      const diasLaborales = Math.ceil(tiempoEstimadoHoras / 8); // Suponiendo una jornada laboral de 8 horas

      setResultado({
        producto: productoSeleccionado.nombre,
        cantidad: cantidad,
        tiempoTotalHoras: tiempoEstimadoHoras,
        diasLaborales: diasLaborales
      });
    }
  };

  // Función para guardar el historial de producción
  const saveHistorialToLocalStorage = (nuevoRegistro) => {
    const nuevoHistorial = [...historialProduccion, nuevoRegistro];
    setHistorialProduccion(nuevoHistorial);
    localStorage.setItem('historialProduccion', JSON.stringify(nuevoHistorial));
  };

  // Función para manejar el botón "Mandar a Producción"
  const handleMandarAProduccion = () => {
    if (!selectedProductoId || !cantidad) return;

    const productoSeleccionado = productos.find(p => p.id === parseInt(selectedProductoId));
    const nuevoRegistro = {
      productoId: selectedProductoId,
      cantidad: parseFloat(cantidad),
      tiempoTotalHoras: resultado.tiempoTotalHoras,
      diasLaborales: resultado.diasLaborales,
      descripcion: "Producción registrada localmente",
      fechaRegistro: new Date().toLocaleString()
    };

    // Guardar en el historial
    saveHistorialToLocalStorage(nuevoRegistro);
    alert('Producción Iniciada');
  };

  // Función para limpiar todos los campos de entrada y el resultado
  const handleCancelar = () => {
    setSelectedProductoId(null);
    setCantidad('');
    setResultado(null);
  };

  return (
    <div className="planificacion-layout">
      <Sidebar />
      <div className="planificacion-card-container">
        <Card className="planificacion-card">
          <Card.Body>
            <Card.Title>Calcular Tiempo de Producción</Card.Title>

            {/* Selector de Producto */}
            <div className="planificacion-input-box">
              <label className="label">Seleccionar Producto:</label>
              <select
                value={selectedProductoId || ""}
                onChange={(e) => setSelectedProductoId(e.target.value)}
                className="planificacion-select"
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo de entrada para la cantidad */}
            <div className="planificacion-input-box">
              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="planificacion-input"
              />
            </div>

            {/* Botón para calcular el tiempo */}
            <button className="planificacion-btn" onClick={handleCalcularTiempo}>
              Calcular Tiempo
            </button>

            {/* Mostrar resultados del cálculo */}
            {resultado && (
              <div className="planificacion-result-box">
                <p>Producto: {resultado.producto}</p>
                <p>Cantidad: {resultado.cantidad}</p>
                <p>Tiempo Total en Horas: {resultado.tiempoTotalHoras}</p>
                <p>Días Laborales: {resultado.diasLaborales}</p>

                <div className="planificacion-button-row">
                  <button className="planificacion-btn" onClick={handleMandarAProduccion}>
                    Mandar a Producción
                  </button>
                  <button className="planificacion-btn-clear" onClick={handleCancelar}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Mostrar el historial de producciones */}
            <div className="planificacion-history-box">
              <Card.Title>Historial de Producción</Card.Title>
              <div className="planificacion-table">
                <div className="planificacion-table-header">
                  <span>Cantidad</span>
                  <span>Horas</span>
                  <span>Días</span>
                  <span>Fecha</span>
                </div>
                {historialProduccion.map((registro, index) => (
                  <div key={index} className="planificacion-table-row">
                    <span>{registro.cantidad}</span>
                    <span>{registro.tiempoTotalHoras}</span>
                    <span>{registro.diasLaborales}</span>
                    <span>{registro.fechaRegistro}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Planificacion;
