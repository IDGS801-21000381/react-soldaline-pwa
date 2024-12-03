import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import Sidebar from "../components/Siderbar";
import "../style/Dashboard.css";

// Registrar los elementos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [estatusCount, setEstatusCount] = useState({ activo: 0, inactivo: 0 });
  const [clientes, setClientes] = useState([]);
  const [showTable, setShowTable] = useState(false);

  // Leer datos del archivo JSON en public/data/clientes.json
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("/data/clientes.json");

        if (!response.ok) {
          console.error("Error al leer el archivo JSON");
          return;
        }

        const data = await response.json();
        console.log("Datos cargados desde clientes.json:", data);

        // Contar los clientes activos e inactivos
        const estatus = { activo: 0, inactivo: 0 };
        data.clientes.forEach((cliente) => {
          if (cliente.estatus === 1) estatus.activo++;
          if (cliente.estatus === 0) estatus.inactivo++;
        });

        setEstatusCount(estatus);
        setClientes(data.clientes);
      } catch (error) {
        console.error("Error al leer los datos de clientes.json:", error);
      }
    };

    fetchClientes();
  }, []);

  // Datos de la gráfica de barras
  const barData = {
    labels: ["Activo", "Inactivo"],
    datasets: [
      {
        label: "Clientes por estatus",
        data: [estatusCount.activo, estatusCount.inactivo],
        backgroundColor: ["#9d6f35", "#d2b48c"],
      },
    ],
  };

  // Datos de la gráfica de pastel
  const pieData = {
    labels: ["Activo", "Inactivo"],
    datasets: [
      {
        data: [estatusCount.activo, estatusCount.inactivo],
        backgroundColor: ["#9d6f35", "#d2b48c"],
      },
    ],
  };

  // Datos de la gráfica de línea (puedes personalizar según tus datos reales)
  const lineData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [
      {
        label: "Ingresos mensuales ($)",
        data: [1000, 1500, 2000, 1800, 2200],
        borderColor: "#ba9359",
        backgroundColor: "rgba(186, 147, 89, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="card">
          <h1 className="card-title">Dashboard</h1>

          {/* Mostrar los números de clientes activos e inactivos */}
          <div className="client-info">
            <p>Total de clientes activos: {estatusCount.activo}</p>
            <p>Total de clientes inactivos: {estatusCount.inactivo}</p>
          </div>

          {/* Gráficas */}
          <div className="charts">
            <div className="chart">
              <h3>Gráfica de Barras - Clientes Potenciales</h3>
              <Bar data={barData} />
            </div>
            <div className="chart">
              <h3>Gráfica de Pastel</h3>
              <Pie data={pieData} />
            </div>
            <div className="chart">
              <h3>Gráfica de Líneas</h3>
              <Line data={lineData} />
            </div>
          </div>

          {/* Botón para mostrar/ocultar la tabla */}
          <div className="table-toggle">
            <button
              className="btn btn-primary"
              onClick={() => setShowTable(!showTable)}
            >
              {showTable ? "Ocultar registros" : "Ver registros"}
            </button>
          </div>

          {/* Tabla de clientes */}
          {showTable && (
            <div className="table-container mt-4">
              <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Empresa</th>
                    <th>Dirección Empresa</th>
                    <th>Teléfono Empresa</th>
                    <th>Correo Empresa</th>
                    <th>Sitio Web</th>
                    <th>Estatus</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.clienteId}>
                      <td>{cliente.clienteId}</td>
                      <td>{cliente.nombreCliente}</td>
                      <td>{cliente.direccionCliente}</td>
                      <td>{cliente.telefonoCliente}</td>
                      <td>{cliente.correoCliente}</td>
                      <td>{cliente.nombreEmpresa}</td>
                      <td>{cliente.direccionEmpresa}</td>
                      <td>{cliente.telefonoEmpresa}</td>
                      <td>{cliente.correoEmpresa}</td>
                      <td>{cliente.sitioWeb}</td>
                      <td>{cliente.estatus === 1 ? "Activo" : "Inactivo"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
