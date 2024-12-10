import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import * as XLSX from "xlsx";
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
} from "chart.js";
import Sidebar from "../components/Siderbar";
import "../style/Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("ventas");
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [clientData, setClientData] = useState([]);
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
        setClientData(data);
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
        backgroundColor: "#4caf50",
        borderColor: "#388e3c",
        borderWidth: 1,
      },
    ],
  };

  const clientChartData = {
    labels: ["Concretos", "Cancelados"],
    datasets: [
      {
        data: [clientStats.concretos, clientStats.cancelados],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverBackgroundColor: ["#388e3c", "#d32f2f"],
      },
    ],
  };

  const clientBarChartData = {
    labels: ["Concretos", "Cancelados"],
    datasets: [
      {
        label: "Clientes",
        data: [clientStats.concretos, clientStats.cancelados],
        backgroundColor: ["#4caf50", "#f44336"],
        borderColor: ["#388e3c", "#d32f2f"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="tab-container">
          <button className={activeTab === "ventas" ? "active" : ""} onClick={() => setActiveTab("ventas")}>
            Ventas
          </button>
          <button className={activeTab === "clientes" ? "active" : ""} onClick={() => setActiveTab("clientes")}>
            Clientes
          </button>
        </div>
        {activeTab === "ventas" && (
          <div>
            <div className="tab-filters">
              <button onClick={() => setFilter("mes")}>Último Mes</button>
              <button onClick={() => setFilter("semana")}>Última Semana</button>
              <button onClick={() => setFilter("dia")}>Hoy</button>
            </div>
            <div className="charts">
              <div className="chart">
                <h3>Total de Ventas</h3>
                <Bar data={salesChartData} />
              </div>
            </div>
          </div>
        )}
        {activeTab === "clientes" && (
          <div>
            <div className="summary-cards">
              <div className="card">
                <h3>Concretos</h3>
                <p>{clientStats.concretos}</p>
              </div>
              <div className="card">
                <h3>Cancelados</h3>
                <p>{clientStats.cancelados}</p>
              </div>
            </div>
            <div className="charts">
              <div className="chart">
                <h3>Distribución de Clientes</h3>
                <Pie data={clientChartData} />
              </div>
              <div className="chart">
                <h3>Clientes por Tipo</h3>
                <Bar data={clientBarChartData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
