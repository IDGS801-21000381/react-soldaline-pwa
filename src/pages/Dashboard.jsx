import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2"; // Tipos de gráficas de Chart.js
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
  const [category, setCategory] = useState("personal");
  const [timeFilter, setTimeFilter] = useState("semana");
  const [estatusCount, setEstatusCount] = useState({ activo: 0, inactivo: 0 });

  // Consumir la API de clientes potenciales
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost:5055/api/EmpresaCliente/get-status");

        if (!response.ok) {
          console.error("Error al obtener los datos de la API");
          return;
        }

        const data = await response.json();
        console.log("Datos recibidos de la API:", data);  // Imprimir los datos recibidos en la consola

        // Contar cuántos clientes están en estatus 1 (Activo) y 2 (Inactivo)
        const estatus = { activo: 0, inactivo: 0 };
        data.forEach(cliente => {
          if (cliente.Estatus === 1) estatus.activo++;
          if (cliente.Estatus === 2) estatus.inactivo++;
        });

        setEstatusCount(estatus); // Actualizar el estado con la cantidad de clientes activos e inactivos

        // Imprimir en consola cuántos clientes están activos e inactivos
        console.log(`Clientes Activos (Estatus 1): ${estatus.activo}`);
        console.log(`Clientes Inactivos (Estatus 2): ${estatus.inactivo}`);
      } catch (error) {
        console.error("Error al obtener los datos de los clientes:", error);
      }
    };

    fetchClientes(); // Realizar la consulta inicial

    const interval = setInterval(() => {
      fetchClientes(); // Hacer la consulta cada 5 segundos
    }, 5000); // Consultar cada 5 segundos para mantener los datos actualizados

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, []);

  // Datos de la gráfica de barras
  const barData = {
    labels: ["Activo", "Inactivo"],
    datasets: [
      {
        label: "Clientes por estatus",
        data: [estatusCount.activo, estatusCount.inactivo],
        backgroundColor: "#9d6f35",
      },
    ],
  };

  // Datos de la gráfica de pastel
  const pieData = {
    labels: ["Marketing", "Ventas", "Planificación"],
    datasets: [
      {
        label: "Distribución de actividades",
        data: [30, 50, 20],
        backgroundColor: ["#9d6f35", "#ba9359", "#423117"],
      },
    ],
  };

  // Datos de la gráfica de línea
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

          {/* Selectores */}
          <div className="filters">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select-category"
            >
              <option value="personal">Personal</option>
              <option value="ventas">Ventas</option>
              <option value="monetario">Monetario</option>
            </select>
            {category === "monetario" && (
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="select-time"
              >
                <option value="dia">Día</option>
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
                <option value="año">Año</option>
              </select>
            )}
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

