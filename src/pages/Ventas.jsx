import React, { useState, useEffect } from 'react';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [venta, setVenta] = useState({
    cliente: '',
    fecha: '',
    productos: [],
    total: 0,
  });

  useEffect(() => {
    // Simula la carga inicial de datos (puedes reemplazarlo con una llamada a la API)
    const ventasIniciales = JSON.parse(localStorage.getItem('ventas')) || [];
    setVentas(ventasIniciales);
  }, []);

  const agregarVenta = () => {
    const nuevasVentas = [...ventas, venta];
    setVentas(nuevasVentas);
    localStorage.setItem('ventas', JSON.stringify(nuevasVentas));
    setVenta({
      cliente: '',
      fecha: '',
      productos: [],
      total: 0,
    });
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setVenta({ ...venta, [name]: value });
  };

  const agregarProducto = () => {
    const nuevoProducto = {
      nombre: '',
      cantidad: 0,
      precio: 0,
    };
    setVenta({
      ...venta,
      productos: [...venta.productos, nuevoProducto],
    });
  };

  const manejarCambioProducto = (index, e) => {
    const { name, value } = e.target;
    const productosActualizados = venta.productos.map((producto, i) =>
      i === index ? { ...producto, [name]: value } : producto
    );
    setVenta({
      ...venta,
      productos: productosActualizados,
    });
  };

  return (
    <div>
      <h1>Registro de Ventas</h1>
      <div>
        <h2>Nueva Venta</h2>
        <label>
          Cliente:
          <input
            type="text"
            name="cliente"
            value={venta.cliente}
            onChange={manejarCambio}
          />
        </label>
        <br />
        <label>
          Fecha:
          <input
            type="date"
            name="fecha"
            value={venta.fecha}
            onChange={manejarCambio}
          />
        </label>
        <h3>Productos</h3>
        {venta.productos.map((producto, index) => (
          <div key={index}>
            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={producto.nombre}
                onChange={(e) => manejarCambioProducto(index, e)}
              />
            </label>
            <label>
              Cantidad:
              <input
                type="number"
                name="cantidad"
                value={producto.cantidad}
                onChange={(e) => manejarCambioProducto(index, e)}
              />
            </label>
            <label>
              Precio:
              <input
                type="number"
                name="precio"
                value={producto.precio}
                onChange={(e) => manejarCambioProducto(index, e)}
              />
            </label>
          </div>
        ))}
        <button onClick={agregarProducto}>Agregar Producto</button>
        <br />
        <button onClick={agregarVenta}>Guardar Venta</button>
      </div>

      <div>
        <h2>Historial de Ventas</h2>
        {ventas.map((v, index) => (
          <div key={index}>
            <p>
              <strong>Cliente:</strong> {v.cliente}
            </p>
            <p>
              <strong>Fecha:</strong> {v.fecha}
            </p>
            <p>
              <strong>Productos:</strong>
            </p>
            <ul>
              {v.productos.map((producto, i) => (
                <li key={i}>
                  {producto.nombre} - {producto.cantidad} x {producto.precio}
                </li>
              ))}
            </ul>
            <p>
              <strong>Total:</strong> ${v.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ventas;
