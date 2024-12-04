import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Siderbar";
import "../style/Dashboard.css";

export default function CuentasXPagar() {
    const location = useLocation();
    const cotizacion = location.state; // Accede a los datos de la cotización
    const [showModal, setShowModal] = useState(false);
    const [monto, setMonto] = useState("");
    const [metodoPago, setMetodoPago] = useState("Transferencia");
    const [pagosRealizados, setPagosRealizados] = useState([]); // Guardamos los pagos realizados
    const [saldoRestante, setSaldoRestante] = useState(cotizacion ? cotizacion.subtotal : 0);

    const handleAtender = () => {
        setShowModal(true); // Abre el modal
    };

    const handleCerrarModal = () => {
        setShowModal(false);
        setMonto(""); // Limpia el monto al cerrar el modal
        setMetodoPago("Transferencia");
    };

    const handlePagar = () => {
        if (!monto || isNaN(monto) || monto <= 0) {
            alert("Por favor, ingresa un monto válido.");
            return;
        }

        // Resta el monto al saldo restante
        const nuevoSaldo = saldoRestante - monto;
        setSaldoRestante(nuevoSaldo);

        // Registra el pago realizado
        const pago = {
            monto,
            metodoPago,
            fecha: new Date().toLocaleString(),
            empresa: cotizacion.nombreEmpresa, // Incluye el nombre de la empresa
        };
        setPagosRealizados((prevPagos) => [...prevPagos, pago]);

        alert(`Pago realizado con éxito.\nMétodo: ${metodoPago}\nMonto: $${monto}`);

        handleCerrarModal(); // Cierra el modal
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <div className="card">
                    <h1 className="card-title">Cuentas por Pagar</h1>
                    {cotizacion ? (
                        <div>
                            {/* Card de detalles de cotización */}
                            <div className="card mt-3">
                                <h2 className="card-title">Detalles de la Cotización</h2>
                                <p><strong>Empresa:</strong> {cotizacion.nombreEmpresa}</p>
                                <p><strong>Vendedor:</strong> {cotizacion.vendedor}</p>
                                <p><strong>Fecha:</strong> {cotizacion.fecha}</p>
                                <p><strong>Precio:</strong> ${saldoRestante}</p>
                            </div>

                            {/* Card de productos */}
                            <div className="card mt-3">
                                <h3 className="card-title">Productos</h3>
                                <ul>
                                    {cotizacion.productos.map((producto, idx) => (
                                        <li key={idx}>
                                            <strong>{producto.nombre}</strong> - 
                                            Cantidad: {producto.cantidad} - 
                                            Subtotal: ${producto.precio * producto.cantidad}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Botón para abrir modal de pago */}
                            <div className="mt-4 text-center">
                                <button className="btn btn-primary" onClick={handleAtender}>
                                    Pagar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <p>No se recibió ninguna cotización.</p>
                        </div>
                    )}

                    {/* Mostrar los pagos realizados */}
                    <div className="card mt-4">
                        <h3 className="card-title">Pagos Realizados</h3>
                        {pagosRealizados.length > 0 ? (
                            <ul>
                                {pagosRealizados.map((pago, idx) => (
                                    <li key={idx}>
                                        <strong>Fecha:</strong> {pago.fecha} - 
                                        <strong>Empresa:</strong> {pago.empresa} - 
                                        <strong>Monto:</strong> ${pago.monto} - 
                                        <strong>Método de Pago:</strong> {pago.metodoPago}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No se ha realizado ningún pago.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para realizar el pago */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Realizar Pago</h2>
                        <p><strong>Empresa:</strong> {cotizacion.nombreEmpresa}</p>
                        <p><strong>Saldo Restante:</strong> ${saldoRestante}</p>

                        <div className="form-group">
                            <label htmlFor="monto">Cantidad a Pagar:</label>
                            <input
                                type="number"
                                id="monto"
                                className="form-control"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="metodoPago">Método de Pago:</label>
                            <select
                                id="metodoPago"
                                className="form-control"
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                            >
                                <option value="Transferencia">Transferencia</option>
                                <option value="Efectivo">Efectivo</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-success" onClick={handlePagar}>
                                Confirmar Pago
                            </button>
                            <button className="btn btn-secondary" onClick={handleCerrarModal}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
