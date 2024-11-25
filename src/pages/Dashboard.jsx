import React, { useState } from "react";
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
import Sidebar from "../components/Siderbar"; // Tu Sidebar
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

  // Datos de la gráfica de barras
  const barData = {
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    datasets: [
      {
        label: "Tareas completadas",
        data: [12, 19, 7, 10, 5],
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
              <h3>Gráfica de Barras</h3>
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
