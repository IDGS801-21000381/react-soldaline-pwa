import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Siderbar";
import { Card } from 'react-bootstrap'; // Para trabajar con el card de manera sencilla
import axios from "axios";
import "../style/Planificacion.css";

const Planificacion = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [resultado, setResultado] = useState(null);
  const [historialProduccion, setHistorialProduccion] = useState([]);

  // Cargar la lista de productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://10.16.14.126:5055/api/productos');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
        alert('No se pudo cargar la lista de productos');
      }
    };
    fetchProductos();
  }, []);

  // Cargar el historial desde localStorage
  useEffect(() => {
    const storedHistorial = localStorage.getItem('historialProduccion');
    if (storedHistorial) {
      setHistorialProduccion(JSON.parse(storedHistorial));
    }
  }, []);

  // Guardar el historial en localStorage
  const saveHistorialToLocalStorage = (nuevoRegistro) => {
    const nuevoHistorial = [...historialProduccion, nuevoRegistro];
    setHistorialProduccion(nuevoHistorial);
    localStorage.setItem('historialProduccion', JSON.stringify(nuevoHistorial));
  };

  // Función para calcular el tiempo estimado de producción
  const handleCalcularTiempo = async () => {
    if (!selectedProductoId) {
      alert('Por favor, selecciona un producto.');
      return;
    }

    try {
      const response = await fetch('http://10.16.14.126:5055/api/planificacion/calcularTiempoProduccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FabricacionId: selectedProductoId,
          Cantidad: parseFloat(cantidad),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResultado(data);
        alert('Cálculo Exitoso');
      } else {
        alert(data.message || 'No se pudo calcular el tiempo de producción');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un problema, inténtalo de nuevo.');
    }
  };

  // Función para manejar el botón "Mandar a Producción"
  const handleMandarAProduccion = async () => {
    if (!selectedProductoId) return;

    try {
      const produccionResponse = await fetch('http://10.16.14.126:5055/api/produccion/solicitarProduccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: 1,
          FabricacionId: selectedProductoId,
          Cantidad: parseFloat(cantidad),
          Descripcion: "Producción generada desde la aplicación",
        }),
      });

      const produccionData = await produccionResponse.json();

      if (produccionResponse.ok) {
        alert('Producción Iniciada');
        
        // Guardar en el historial local
        const nuevoRegistro = {
          productoId: selectedProductoId,
          cantidad: parseFloat(cantidad),
          tiempoTotalHoras: resultado.tiempoTotalHoras,
          diasLaborales: resultado.diasLaborales,
          descripcion: "Producción registrada localmente",
          fechaRegistro: new Date().toLocaleString()
        };

        saveHistorialToLocalStorage(nuevoRegistro);

      } else {
        alert('No se pudo iniciar la producción');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un problema, inténtalo de nuevo.');
    }
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
                    {producto.nombreProducto}
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

