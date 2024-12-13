import React, { useState, useEffect } from "react";
import Sidebar from "../components/Siderbar";
import "../style/Ventas.css"; // Importa el CSS de ventas
import { Modal, Button, Form } from "react-bootstrap";
import jsPDF from "jspdf"; // Importa la librería jsPDF

export default function Ventas() {
    const [productos, setProductos] = useState([]); // Se inicia vacío, porque los productos vendrán de la API
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [mostrarLista, setMostrarLista] = useState(false);
    const [mostrarModalDatos, setMostrarModalDatos] = useState(false);
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [vendedor, setVendedor] = useState("");
    const traducirEstatus = (status) => {
      switch (status) {
          case 0:
              return 'Pendiente';
          case 1:
              return 'Aprobada';
          case 2:
              return 'Rechazada';
          default:
              return 'Desconocido';
      }
  };
    const [cantidadProducto, setCantidadProducto] = useState(1);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [mostrarModalCantidad, setMostrarModalCantidad] = useState(null);
    const [empresas, setEmpresas] = useState([]); // Lista de empresas
    const [idEmpresaSeleccionada, setIdEmpresaSeleccionada] = useState(null); // ID de la empresa seleccionada
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null); // Objeto completo de la empresa seleccionada
    const [usuario, setUsuario] = useState([]);
    const [cotizacionesPendientes, setCotizacionesPendientes] = useState([]);
    const handleEmpresaChange = (idEmpresa) => {
      console.log("Empresa seleccionada: ", idEmpresa); // Verifica si el ID está correctamente actualizado
      setIdEmpresaSeleccionada(idEmpresa);
    
      // Buscar la empresa seleccionada por su ID
      const seleccionada = empresas.find((empresa) => empresa.empresaId === idEmpresa);
      console.log("Empresa encontrada: ", seleccionada); // Verifica si la empresa se encuentra correctamente
      setEmpresaSeleccionada(seleccionada || null);
    };
    // Función para calcular el subtotal
    const calcularSubtotal = (productos) =>
        productos.reduce((total, prod) => total + prod.precio * prod.cantidad, 0);
    useEffect(() => {
    
      
      const usuarioData = localStorage.getItem("usuario");
      if (usuarioData) {
        setUsuario(JSON.parse(usuarioData)) ;
        
      }
    }, []);
    const cargarCotizaciones = async () => {
      try {
          console.log("AAAAAAAAAAAAAAAAA");
          const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/Cotizaciones/getAll');

          if (response.ok) {
              const data = await response.json();
              setCotizacionesPendientes(data);
              console.log("cotizaciones pendientes data",data);
          } else {
              console.log('Error al cargar las cotizaciones:', response.status);
          }
      } catch (error) {
          console.error('Error en la solicitud:', error);
      }
  };
  const registrarVenta = async (cotizacion) => {
    try {
        // Construir la URL del endpoint
        const url = 'https://bazar20241109230927.azurewebsites.net/api/Venta/PostVenta';

        // Transformar los datos de la cotización al formato esperado por el endpoint
        const ventaData = {
            folio: `COT-${cotizacion.cotizacionId}`, // Usamos el ID de la cotización como folio
            usuarioId: cotizacion.idVendedor, // ID del vendedor que autorizó
            detallesVenta: cotizacion.detalleCotizacions.map((detalle) => ({
                cantidad: detalle.cantidad,
                precioUnitario: detalle.precioUnitario,
                inventarioProductoId: detalle.inventarioProductoId,
                clientePotencialDescuento: 0, // Puedes ajustar esto según sea necesario
            })),
        };

        // Realizar la solicitud POST al endpoint
        const response = await fetch(url, {
            method: 'POST', // Método HTTP POST
            headers: {
                'Content-Type': 'application/json', // Indicar que enviamos JSON
            },
            body: JSON.stringify(ventaData), // Convertir el objeto a JSON
        });

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al registrar la venta: ${errorText}`);
        }

        const data = await response.json(); // Leer la respuesta del servidor
        console.log('Venta registrada exitosamente:', data);

        // Notificar al usuario
        alert(`La venta con folio ${ventaData.folio} ha sido registrada exitosamente.`);
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        alert(`Hubo un error al registrar la venta: ${error.message}`);
    }
};

  
  useEffect(() => {
      cargarCotizaciones();
  }, []);
    // Cargar productos desde la API usando useEffect
    /*useEffect(() => {
      fetch('https://bazar20241109230927.azurewebsites.net/api/Inventario/productos')
          .then((response) => response.json())
          .then((data) => {
              const productosConImagen = data.map((producto) => ({
                  ...producto,
                  imagen: producto.imagenProducto || "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp",
              }));
              console.log("PRODUCTOS: ",data);
              setProductos(productosConImagen);
          })
          .catch((error) => {
              
              console.error('Error al cargar los productos:', error);
          });
          
  }, []);*/
  useEffect(() => {
    fetch('http://soldaline8.somee.com/api/Inventario/producto')
        .then((response) => response.json())
        .then((data) => {
            // Mapeo de datos para incluir las imágenes desde `fabricacion.imagenProducto`
            const productosConImagen = data.map((producto) => ({
                ...producto,
                imagen: producto.fabricacion.imagenProducto 
                    ? producto.fabricacion.imagenProducto 
                    : "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp",
                nombreProducto: producto.fabricacion.nombreProducto // Nombre para usarlo más fácilmente
            }));
            console.log("PRODUCTOS CON IMAGEN: ", productosConImagen);
            setProductos(productosConImagen);
        })
        .catch((error) => {
            console.error('Error al cargar los productos:', error);
        });
}, []);
  useEffect(() => {
    fetch('https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista')
        .then((response) => response.json())
        .then((data) => {
            setEmpresas(data);

            // Seleccionar la primera empresa válida por defecto
            if (data.length > 0) {
                const empresaPorDefecto = data[0];
                setIdEmpresaSeleccionada(empresaPorDefecto.empresaId);
                setEmpresaSeleccionada(empresaPorDefecto);
            }
            console.log("empresas: ",empresas);
        console.log("idEmpresas: ",idEmpresaSeleccionada);
        console.log("empresa seleccionada: ",empresaSeleccionada);
        })
        .catch((error) => {
            console.error('Error al cargar las empresas:', error);
        });
        
}, []);

    const agregarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setMostrarModalCantidad(true);
    };

   const guardarProductoCarrito = () => {
    if (cantidadProducto > productoSeleccionado.cantidad) {
        alert(`La cantidad ingresada (${cantidadProducto}) excede el stock disponible (${productoSeleccionado.cantidad}).`);
        return;
    }

    const productoConCantidad = { 
        ...productoSeleccionado, 
        cantidad: cantidadProducto 
    };
    setProductosSeleccionados([...productosSeleccionados, productoConCantidad]);
    setMostrarModalCantidad(false);
};
    const guardarCotizacion = () => {
      
      const nuevaCotizacion = {
        empresaID: empresaSeleccionada.empresaId,  // Asignar un valor válido
        clienteID: empresaSeleccionada.clienteId,  // Asignar un valor válido
        vendedor: usuario.nombre,
        idVendedor: usuario.id,  // Asignar el ID del vendedor
        total: productosSeleccionados.reduce((total, producto) => 
            total + producto.precio * producto.cantidad, 0),  // Calcular el total de la cotización
        detalleCotizacions: productosSeleccionados.map((producto) => ({  // Cambiado a detalleCotizacions
            inventarioProductoId: producto.id,  // ID del producto
            cantidad: producto.cantidad,  // Cantidad del producto
            precioUnitario: producto.precio,  // Precio unitario del producto
            costo: producto.precio * producto.cantidad  // Costo total del producto
        }))
    };
        console.log("Usuario: ",usuario.nombre);
        console.log('Guardando cotización con los siguientes datos:', nuevaCotizacion);
        
        try {
          console.log('queeeee');
          // Llamada POST para guardar la cotización
          const response =  fetch('https://bazar20241109230927.azurewebsites.net/api/Cotizaciones', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(nuevaCotizacion),
          });
  
          if (response.ok) {
              alert('Cotización guardada exitosamente.');
              // Actualizar la lista de cotizaciones después de guardar
              //cargarCotizaciones();
          } else {
              console.error('Error al guardar la cotización:', response);
              alert('Cotización guardada exitosamente!!!.');
              //alert('Ocurrió un error al guardar la cotización.',response);
              cargarCotizaciones();
          }
      } catch (error) {
          console.error('Error en la solicitud:', error);
          alert('Error de red al intentar guardar la cotización.');
      }
        //setCotizacionesPendientes([...cotizacionesPendientes, nuevaCotizacion]);
        setProductosSeleccionados([]);
        setMostrarModalDatos(false);
    };

    const handleGuardarCotizacion=()=>{
      if (productosSeleccionados.length === 0) {
          alert("El carrito está vacío. Agrega productos antes de generar una cotización.");
          return; // Salir de la función si el carrito está vacío
      }
      guardarCotizacion();
      
      
  }
  const cambiarStatusCotizacion = async (cotizacion, nuevoStatus) => {
    try {
        // Verificar si la cotización ya está autorizada
        if (cotizacion.status === 1) {
            alert(`La cotización ${cotizacion.cotizacionId} ya está autorizada y no se puede autorizar nuevamente.`);
            return;
        }

        const url = `https://bazar20241109230927.azurewebsites.net/api/Cotizaciones/${cotizacion.cotizacionId}/status`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoStatus),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al cambiar el estado: ${errorText}`);
        }

        const data = await response.text();
        console.log('Estado actualizado:', data);
        alert(`Estado de la cotización ${cotizacion.cotizacionId} cambiado a ${nuevoStatus}`);

        // Si el nuevo estado es "Autorizado" (1), registrar la venta
        if (nuevoStatus === 1) {
            await registrarVenta(cotizacion);
        }
    } catch (error) {
        console.error('Error al cambiar el estado:', error);
        alert(`Hubo un error al cambiar el estado: ${error.message}`);
    }
};


    const generarPDF = (cotizacion) => {
      const doc = new jsPDF();
      const fechaFormateada = new Date().toLocaleDateString();
      const total = cotizacion.total.toFixed(2); // Usar el total de la cotización directamente
  
      const htmlContent = `
          <div style="border: 3px solid black; padding: 20px; width: 95%; margin: auto; font-family: Arial, sans-serif;">
              <h1 style="text-align: center; font-size: 2em; margin-top: 0; font-weight: bold;">SOLDALINE</h1>
              <h2 style="text-align: center;">Cotización</h2>
              <p>Fecha: ${fechaFormateada}</p>
              <p>Empresa: ${cotizacion.nombreEmpresa}</p>
              <p>Vendedor: ${cotizacion.nombreVendedor}</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                  <thead>
                      <tr>
                          <th style="border: 1px solid black; padding: 10px; text-align: left;">Producto</th>
                          <th style="border: 1px solid black; padding: 10px; text-align: left;">Cantidad</th>
                          <th style="border: 1px solid black; padding: 10px; text-align: left;">Subtotal</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${cotizacion.detalleCotizacions.map(p => `
                          <tr>
                              <td style="border: 1px solid black; padding: 10px;">${p.nombreProducto}</td>
                              <td style="border: 1px solid black; padding: 10px;">${p.cantidad}</td>
                              <td style="border: 1px solid black; padding: 10px;">$${(p.precioUnitario * p.cantidad).toFixed(2)}</td>
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
          windowWidth: 650
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
                                alt={producto.fabricacion.nombreProducto}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{producto.fabricacion.nombreProducto}</h5>
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
                                    {`${prod.nombreFabricacion} - Cantidad: ${prod.cantidad} - Total: $${prod.precio * prod.cantidad}`}
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
                <Modal
    show={mostrarModalCantidad}
    onHide={() => setMostrarModalCantidad(false)}
    className="modal-float"  // Asegúrate de que esta clase CSS esté definida
> <div className="modal-float">
    <Modal.Header >
        <Modal.Title>Ingrese la Cantidad</Modal.Title>
    </Modal.Header>
    <Modal.Body >
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
    </div>
</Modal>

<Modal
    show={mostrarModalDatos}
    onHide={() => setMostrarModalDatos(false)}
    className="modal-float"  // Asegúrate de que esta clase CSS esté definida
><div className="modal-float">
    <Modal.Header >
        <Modal.Title>Ingrese los datos</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            
            <Form.Label>Selecciona la Empresa</Form.Label>
    <Form.Control
        as="select"
        value={idEmpresaSeleccionada || ''}
        onChange={(e) => handleEmpresaChange(Number(e.target.value))}
    >
        <option value="">Seleccione una empresa</option>
        {empresas.map((empresa) => (
            <option key={empresa.empresaId} value={empresa.empresaId}>
                {empresa.nombreEmpresa}
            </option>
        ))}
    </Form.Control>
         
           
        </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="success" onClick={handleGuardarCotizacion}>
            Guardar Cotización
        </Button>
        <Button variant="danger" onClick={() => setMostrarModalDatos(false)}>
            Cancelar
        </Button>
    </Modal.Footer>
    </div>
</Modal>


                <h2 className="mt-5">Cotizaciones Pendientes:</h2>
                {cotizacionesPendientes.map((cotizacion) => (
                    <div key={cotizacion.id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Empresa: {cotizacion.nombreEmpresa}</h5>
                            <p className="card-text">Vendedor: {cotizacion.vendedor}</p>
                            <p className="card-text">Fecha: {cotizacion.fecha}</p>
                            <p className="card-text">Total: ${cotizacion.total}</p>
                            <p className="card-text">Estatus: {traducirEstatus(cotizacion.status)}</p>
                            <h6>Productos:</h6>
                              {cotizacion.detalleCotizacions.map((producto, idx) => (
                    <li key={idx}>
                        {producto.nombreProducto} - Cantidad: {producto.cantidad} - Subtotal: ${producto.precioUnitario * producto.cantidad}
                    </li>
                ))}
                            <Button variant="secondary" onClick={() => generarPDF(cotizacion)}>
    Generar PDF
</Button>
<Button
    variant="success"
    onClick={() => cambiarStatusCotizacion(cotizacion, 1)} // Cambiar a "Autorizado" y registrar como venta
    disabled={cotizacion.status === 1} // Deshabilitar si ya está autorizado
>
    {cotizacion.status === 1 ? 'Ya Autorizado' : 'Autorizar y Registrar Venta'}
</Button>
<Button
    variant="secondary"
    onClick={() => cambiarStatusCotizacion(cotizacion, 0)} // Cambia 0 por otro estado
>
    Cambiar status a Pendiente
</Button>
<Button
    variant="secondary"
    onClick={() => cambiarStatusCotizacion(cotizacion, 2)} // Cambia 3 por otro estado
>
    Cambiar status a Rechazada
</Button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
