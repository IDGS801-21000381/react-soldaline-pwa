import React from "react";
import Sidebar from "../components/Siderbar";
import "../style/Leads.css";

const Marketing = () => {
  return (
    <div className="leads-layout">
      <Sidebar />
      <div className="leads-card-container">
        <div className="leads-card">
          <div className="leads-header">
            <h1>Marketing</h1>
          </div>
          <div className="leads-list">
            <p>Este espacio está listo para agregar contenido relacionado con Marketing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
