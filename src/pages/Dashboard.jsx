import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import Sidebar from "../components/Siderbar";
import "../style/Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("ventas");
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [clientStats, setClientStats] = useState({ concretos: 0, cancelados: 0 });
  const [filter, setFilter] = useState("mes");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("https://bazar20241109230927.azurewebsites.net/api/GetDashboard");
        const data = await response.json();
        const transformedData = data.map(item => ({
          fecha: item.fecha,
          cantidad: item.cantidad,
          precio: item.precioUnitario,
          totalVenta: item.cantidad * item.precioUnitario,
        }));
        setSalesData(transformedData);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };

    const fetchClientData = async () => {
      try {
        const response = await fetch("https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista");
        const data = await response.json();
        const concretos = data.filter(client => client.estatus === 1).length;
        const cancelados = data.filter(client => client.estatus !== 1).length;
        setClientStats({ concretos, cancelados });
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchSalesData();
    fetchClientData();
  }, []);

  useEffect(() => {
    const now = dayjs();
    let filtered = [];

    if (filter === "mes") {
      filtered = salesData.filter(item => dayjs(item.fecha).isSame(now, "month"));
    } else if (filter === "semana") {
      filtered = salesData.filter(item => dayjs(item.fecha).isSame(now, "week"));
    } else if (filter === "dia") {
      filtered = salesData.filter(item => dayjs(item.fecha).isSame(now, "day"));
    }

    setFilteredData(filtered);
  }, [filter, salesData]);

  const salesChartData = {
    labels: filteredData.map((item, index) => `Venta ${index + 1}`),
    datasets: [
      {
        label: "Total de Ventas",
        data: filteredData.map(item => item.totalVenta),
        backgroundColor: "#9d743f",
        borderColor: "#aba596",
        borderWidth: 1,
      },
    ],
  };

  const salesLineData = {
    labels: filteredData.map(item => dayjs(item.fecha).format("DD-MM-YYYY")),
    datasets: [
      {
        label: "Ingreso Diario ($)",
        data: filteredData.map(item => item.totalVenta),
        borderColor: "#ba9359",
        backgroundColor: "rgba(186, 147, 89, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const clientChartData = {
    labels: ["Concretos", "Cancelados"],
    datasets: [
      {
        data: [clientStats.concretos, clientStats.cancelados],
        backgroundColor: ["#9d743f", "#aba596"],
        hoverBackgroundColor: ["#7f5d32", "#8d8b7e"],
      },
    ],
  };

  const clientBarData = {
    labels: ["Concretos", "Cancelados"],
    datasets: [
      {
        label: "Clientes",
        data: [clientStats.concretos, clientStats.cancelados],
        backgroundColor: "#9d743f",
        borderColor: "#aba596",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="card-title">Dashboard</h1>
        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === "ventas" ? "active" : ""}`}
            onClick={() => setActiveTab("ventas")}
          >
            Ventas
          </button>
          <button
            className={`tab-button ${activeTab === "clientes" ? "active" : ""}`}
            onClick={() => setActiveTab("clientes")}
          >
            Clientes
          </button>
        </div>
        <div className="content">
          {activeTab === "ventas" && (
            <div>
              <div className="filters">
                <button
                  className={`filter-button ${filter === "mes" ? "selected" : ""}`}
                  onClick={() => setFilter("mes")}
                >
                  Último Mes
                </button>
                <button
                  className={`filter-button ${filter === "semana" ? "selected" : ""}`}
                  onClick={() => setFilter("semana")}
                >
                  Última Semana
                </button>
                <button
                  className={`filter-button ${filter === "dia" ? "selected" : ""}`}
                  onClick={() => setFilter("dia")}
                >
                  Hoy
                </button>
              </div>
              <div className="charts">
                <div className="card chart-card">
                  <h3 className="card-title">Total de Ventas</h3>
                  <Bar data={salesChartData} />
                </div>
                <div className="card chart-card">
                  <h3 className="card-title">Ingreso Diario</h3>
                  <Line data={salesLineData} />
                </div>
              </div>
            </div>
          )}
          {activeTab === "clientes" && (
            <div>
              <div className="summary-cards">
                <div className="card summary-card">
                  <h3>Concretos</h3>
                  <p>{clientStats.concretos}</p>
                </div>
                <div className="card summary-card">
                  <h3>Cancelados</h3>
                  <p>{clientStats.cancelados}</p>
                </div>
              </div>
              <div className="charts">
                <div className="card chart-card">
                  <h3 className="card-title">Distribución de Clientes</h3>
                  <Pie data={clientChartData} />
                </div>
                <div className="card chart-card">
                  <h3 className="card-title">Clientes</h3>
                  <Bar data={clientBarData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
