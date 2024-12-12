import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Siderbar";
import { Card } from 'react-bootstrap';
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
        const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/Productos/getAll');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProductos(data);
        } else {
          console.error("No se encontraron productos.");
        }
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
      const parsedHistorial = JSON.parse(storedHistorial);
      if (Array.isArray(parsedHistorial)) {
        setHistorialProduccion(parsedHistorial);
      } else {
        console.error("No hay historial válido en localStorage.");
      }
    }
  }, []);

  // Guardar el historial en localStorage
  const saveHistorialToLocalStorage = (nuevoRegistro) => {
    const nuevoHistorial = [...historialProduccion, nuevoRegistro];
    setHistorialProduccion(nuevoHistorial);
    localStorage.setItem('historialProduccion', JSON.stringify(nuevoHistorial));
  };

  // Función para calcular las estimaciones de producción
  const handleCalcularTiempo = async () => {
    if (!selectedProductoId || !cantidad) {
      alert('Por favor selecciona un producto y una cantidad.');
      return;
    }

    try {
      const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/Planificacion/calcularTiempoProduccion', {
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
        alert('Cálculo de tiempo de producción realizado con éxito.');
      } else {
        alert(data.message || 'No se pudo calcular el tiempo de producción.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un problema al calcular el tiempo de producción.');
    }
  };

  // Función para confirmar la producción
  const handleMandarAProduccion = async () => {
    if (!selectedProductoId || !resultado) {
      alert('Por favor calcula el tiempo antes de mandar a producción.');
      return;
    }

    try {
      const solicitudProduccion = {
        UsuarioId: 1, // Cambiar si tienes un sistema de usuarios dinámico
        Productos: [
          {
            FabricacionId: selectedProductoId,
            Cantidad: parseFloat(cantidad),
            Descripcion: `Producción para el producto seleccionado`,
          },
        ],
      };

      const produccionResponse = await fetch('https://bazar20241109230927.azurewebsites.net/api/produccion/solicitarProduccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitudProduccion),
      });

      const produccionData = await produccionResponse.json();

      if (produccionResponse.ok) {
        alert(produccionData.Mensaje || 'Producción registrada exitosamente.');

        const nuevoRegistro = {
          productoId: selectedProductoId,
          cantidad: parseFloat(cantidad),
          tiempoTotalHoras: resultado.tiempoTotalHoras,
          diasLaborales: resultado.diasLaborales,
          descripcion: `Producción registrada`,
          fechaRegistro: new Date().toLocaleString(),
        };
        saveHistorialToLocalStorage(nuevoRegistro);
        handleCancelar(); // Limpia los datos después de registrar la producción
      } else {
        alert(produccionData.mensaje || 'No se pudo registrar la solicitud de producción.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un problema al mandar a producción.');
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
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombreProducto}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay productos disponibles</option>
                )}
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
                    Confirmar Producción
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
              {historialProduccion.length > 0 ? (
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
              ) : (
                <p>No hay historial de producción disponible.</p>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Planificacion;
