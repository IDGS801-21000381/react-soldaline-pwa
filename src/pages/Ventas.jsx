import React, { useState } from "react";
import Sidebar from "../components/Siderbar";
import "../style/Ventas.css"; // Importa el CSS de ventas
import { Modal, Button, Form } from "react-bootstrap";
import jsPDF from "jspdf"; // Importa la librería jsPDF


const productosIniciales = [
    { id: 1, nombre: "Puerta de hierro", precio: 1500, cantidad: 5, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
    { id: 2, nombre: "Reja de ventana", precio: 800, cantidad: 10, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
    { id: 3, nombre: "Barandal de escalera", precio: 1200, cantidad: 8, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
    { id: 4, nombre: "Reja", precio: 1200, cantidad: 8, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
    { id: 5, nombre: "Escalera", precio: 1200, cantidad: 8, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" }
];

export default function Ventas() {
    const [productos, setProductos] = useState(productosIniciales);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [mostrarLista, setMostrarLista] = useState(false);
    const [mostrarModalDatos, setMostrarModalDatos] = useState(false);
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [vendedor, setVendedor] = useState("");
    const [cotizacionesPendientes, setCotizacionesPendientes] = useState([]);
    const [cantidadProducto, setCantidadProducto] = useState(1);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [mostrarModalCantidad, setMostrarModalCantidad] = useState(null);

    const calcularSubtotal = (productos) =>
        productos.reduce((total, prod) => total + prod.precio * prod.cantidad, 0);

    const agregarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setMostrarModalCantidad(true);
    };

    const guardarProductoCarrito = () => {
        const productoConCantidad = { ...productoSeleccionado, cantidad: cantidadProducto };
        setProductosSeleccionados([...productosSeleccionados, productoConCantidad]);
        setMostrarModalCantidad(false);
    };

    const guardarCotizacion = () => {
        const nuevaCotizacion = {
            id: cotizacionesPendientes.length + 1,
            nombreEmpresa,
            vendedor,
            productos: productosSeleccionados,
            subtotal: calcularSubtotal(productosSeleccionados),
            fecha: new Date().toLocaleDateString(),
        };
        setCotizacionesPendientes([...cotizacionesPendientes, nuevaCotizacion]);
        setProductosSeleccionados([]);
        setMostrarModalDatos(false);
    };

    

    const generarPDF = () => {
        const doc = new jsPDF();
        const fechaFormateada = new Date().toLocaleDateString(); // Fecha actual
        const total = calcularSubtotal(productosSeleccionados).toFixed(2);
        
        const htmlContent = `
            <div style="border: 3px solid black; padding: 20px; width: 95%; margin: auto; font-family: Arial, sans-serif;">
                <h1 style="text-align: center; font-size: 2em; margin-top: 0; font-weight: bold;">SOLDALINE</h1>
                <h2 style="text-align: center;">Cotización</h2>
                <p>Fecha: ${fechaFormateada}</p>
                <p>Empresa: ${nombreEmpresa}</p>
                <p>Vendedor: ${vendedor}</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid black; padding: 10px; text-align: left;">Producto</th>
                            <th style="border: 1px solid black; padding: 10px; text-align: left;">Cantidad</th>
                            <th style="border: 1px solid black; padding: 10px; text-align: left;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productosSeleccionados.map(p => `
                            <tr>
                                <td style="border: 1px solid black; padding: 10px;">${p.nombre}</td>
                                <td style="border: 1px solid black; padding: 10px;">${p.cantidad}</td>
                                <td style="border: 1px solid black; padding: 10px;">$${(p.precio * p.cantidad).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <h3 style="text-align: right; margin-top: 20px;">Total Estimado: $${total}</h3>
                <p style="text-align: center; font-style: italic; color: gray; margin-top: 20px;">Esta es solo una cotización, no confirma la compra.</p>
            </div>
        `;
        
        doc.html(htmlContent, {
            callback: function (doc) {
                doc.save('cotizacion.pdf');
            },
            x: 10,
            y: 10,
            width: 180,
            windowWidth: 650 // Establecer el ancho de la ventana para que se ajuste al contenido
        });
    };
    
  

    return (
        <div className="ventas-layout">
            <Sidebar />
            <div className="container mt-5">
                <h1 className="mb-4 text-center">Lista de Productos</h1>
                <div className="row">
                    {productos.map((producto) => (
                        <div className="card" key={producto.id}>
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{producto.nombre}</h5>
                                <p className="card-text">Precio: ${producto.precio}</p>
                                <p className="card-text">Cantidad: {producto.cantidad}</p>
                                <Button variant="primary" onClick={() => agregarProducto(producto)}>
                                    Agregar al carrito
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    className="boton-flotante"
                    onClick={() => setMostrarLista(!mostrarLista)}
                >
                    {mostrarLista ? "Ocultar Carrito" : "🛒"}
                </Button>

                {mostrarLista && (
                    <div className="carrito-flotante">
                        <h2>Productos Seleccionados:</h2>
                        <ul className="list-group">
                            {productosSeleccionados.map((prod, index) => (
                                <li key={index} className="list-group-item">
                                    {`${prod.nombre} - Cantidad: ${prod.cantidad} - Total: $${prod.precio * prod.cantidad}`}
                                </li>
                            ))}
                        </ul>
                        <h3 className="mt-3">Subtotal: ${calcularSubtotal(productosSeleccionados)}</h3>
                        <div className="d-flex gap-2 mt-2">
                            <Button
                                variant="success"
                                onClick={() => setMostrarModalDatos(true)}
                            >
                                Generar Cotización
                            </Button>
                        </div>
                    </div>
                )}

                {/* Modal para ingresar la cantidad */}
                <Modal show={mostrarModalCantidad} onHide={() => setMostrarModalCantidad(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ingrese la Cantidad</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={cantidadProducto}
                                    onChange={(e) => setCantidadProducto(Number(e.target.value))}
                                    min="1"
                                    max={productoSeleccionado?.cantidad}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={guardarProductoCarrito}>
                            Agregar al Carrito
                        </Button>
                        <Button variant="danger" onClick={() => setMostrarModalCantidad(false)}>
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={mostrarModalDatos} onHide={() => setMostrarModalDatos(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ingrese los datos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Nombre de la Empresa</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nombreEmpresa}
                                    onChange={(e) => setNombreEmpresa(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Nombre del Vendedor</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={vendedor}
                                    onChange={(e) => setVendedor(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={guardarCotizacion}>
                            Guardar Cotización
                        </Button>
                        <Button variant="danger" onClick={() => setMostrarModalDatos(false)}>
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <h2 className="mt-5">Cotizaciones Pendientes:</h2>
{cotizacionesPendientes.map((cotizacion) => (
    <div key={cotizacion.id} className="card mb-3">
        <div className="card-body">
            <h5 className="card-title">Empresa: {cotizacion.nombreEmpresa}</h5>
            <p className="card-text">Vendedor: {cotizacion.vendedor}</p>
            <p className="card-text">Fecha: {cotizacion.fecha}</p>
            <p className="card-text">Subtotal: ${cotizacion.subtotal}</p>
            <h6>Productos:</h6>
            <ul>
                {cotizacion.productos.map((producto, idx) => (
                    <li key={idx}>
                        {producto.nombre} - Cantidad: {producto.cantidad} - Subtotal: ${producto.precio * producto.cantidad}
                    </li>
                ))}
            </ul>
            <Button variant="secondary" onClick={generarPDF}>
                Generar PDF
            </Button>
        </div>
    </div>
))}

            </div>
        </div>
    );
}
