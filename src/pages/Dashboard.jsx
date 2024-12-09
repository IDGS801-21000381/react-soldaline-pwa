import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from "react-native";
import { Bar, Pie, Line } from "react-chartjs-2";
import { LineChart } from "react-native-chart-kit";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
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
  PointElement,
  LineElement,
} from "chart.js";
import Sidebar from "../components/Siderbar";
import "../style/Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const [filter, setFilter] = useState("mes");
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("https://bazar20241109230927.azurewebsites.net/api/GetDashboard");
        const data = await response.json();
        const transformedData = data.map(item => ({
          cantidad: item.cantidad,
          precio: item.precioUnitario,
          totalVenta: item.cantidad * item.precioUnitario,
          fecha: item.fecha,
        }));
        setSalesData(transformedData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await fetch("/data/clientes.json");
        if (!response.ok) return;
        const data = await response.json();
        setClientes(data.clientes);
      } catch (error) {}
    };

    fetchSalesData();
    fetchClientes();
  }, []);

  useEffect(() => {
    const now = dayjs();
    let filteredData = [];
    if (filter === "mes") {
      filteredData = clientes.filter(cliente => dayjs(cliente.fecha).isSame(now, "month"));
    } else if (filter === "semana") {
      filteredData = clientes.filter(cliente => dayjs(cliente.fecha).isSame(now, "week"));
    } else if (filter === "dia") {
      filteredData = clientes.filter(cliente => dayjs(cliente.fecha).isSame(now, "day"));
    }
    setFilteredClientes(filteredData);
  }, [filter, clientes]);

  const getFilteredSalesData = () => {
    const now = dayjs();
    let filteredData = [];
    if (filter === "mes") {
      filteredData = salesData.filter(item => dayjs(item.fecha).isSame(now, "month"));
    } else if (filter === "semana") {
      filteredData = salesData.filter(item => dayjs(item.fecha).isSame(now, "week"));
    } else if (filter === "dia") {
      filteredData = salesData.filter(item => dayjs(item.fecha).isSame(now, "day"));
    }
    return {
      labels: filteredData.map((_, index) => `Venta ${index + 1}`),
      datasets: [
        {
          data: filteredData.map(item => item.totalVenta),
          color: () => `rgba(0, 191, 255, 1)`,
        },
      ],
    };
  };

  const getTotalSales = () => {
    return salesData.reduce((acc, venta) => acc + venta.totalVenta, 0);
  };

  const getTotalProfit = () => {
    return getTotalSales() * 0.3;
  };

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  const exportToExcel = async () => {
    const wsData = salesData.map((venta, index) => ({
      Fecha: `Venta ${index + 1}`,
      Producto: "Protección",
      Cantidad: venta.cantidad,
      Precio: `$${venta.precio.toFixed(2)}`,
      VentaTotal: `$${venta.totalVenta.toFixed(2)}`,
      Ganancia: `$${(venta.totalVenta * 0.3).toFixed(2)}`,
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SalesData");
    const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
    if (Platform.OS === "web") {
      const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ventas_${filter}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const uri = FileSystem.cacheDirectory + `ventas_${filter}.xlsx`;
      await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(uri);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff" },
  };

  const barData = {
    labels: ["Activo", "Inactivo"],
    datasets: [
      {
        label: "Clientes por estatus",
        data: [
          filteredClientes.filter(c => c.estatus === 1).length,
          filteredClientes.filter(c => c.estatus === 0).length,
        ],
        backgroundColor: ["#9d6f35", "#d2b48c"],
      },
    ],
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tab} onPress={() => setFilter("mes")}>
            <Text style={styles.tabText}>Mes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setFilter("semana")}>
            <Text style={styles.tabText}>Semana</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setFilter("dia")}>
            <Text style={styles.tabText}>Día</Text>
          </TouchableOpacity>
        </View>
        <div className="dashboard-content">
          <div className="charts">
            <div className="chart">
              <h3>Ventas</h3>
              <LineChart
                data={getFilteredSalesData()}
                width={screenWidth * 0.9}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </div>
            <div className="chart">
              <h3>Clientes Potenciales</h3>
              <Pie data={barData} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowTable(!showTable)}>
            {showTable ? "Ocultar registros" : "Ver registros"}
          </button>
          {showTable && (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Estatus</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map(cliente => (
                    <tr key={cliente.clienteId}>
                      <td>{cliente.clienteId}</td>
                      <td>{cliente.nombreCliente}</td>
                      <td>{cliente.estatus === 1 ? "Activo" : "Inactivo"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <TouchableOpacity style={styles.exportButton} onPress={exportToExcel}>
          <Text style={styles.exportText}>Exportar a Excel</Text>
        </TouchableOpacity>
      </View>
    </div>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  tabContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  tab: { padding: 10, backgroundColor: "#e0e0e0", borderRadius: 10 },
  tabText: { fontSize: 16, color: "#000" },
  chart: { borderRadius: 16 },
  exportButton: { padding: 10, backgroundColor: "#00bfff", borderRadius: 10, alignItems: "center" },
  exportText: { color: "#fff", fontSize: 16 },
});

export default Dashboard;
