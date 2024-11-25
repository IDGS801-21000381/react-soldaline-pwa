import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUserTie, FaBullhorn, FaClock, FaChartBar, FaSignOutAlt } from 'react-icons/fa'; // Iconos
import Logo from './Logo'; // Componente del logo
import Greeting from './Greeting'; // Componente de saludo
import '../style/Sidebar.css'; // Hoja de estilos

const Sidebar = ({ username }) => {
    return (
        <div className="sidebar">
            {/* Encabezado */}
            <div className="sidebar-header">
                <Logo />
                <h1 className="brand-name">Soldaline</h1>
            </div>

            {/* Menú de navegación */}
            <nav className="menu">
                <ul>
                    <li>
                        <Link to="/dashboard">
                            <FaTachometerAlt className="icon" />
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/clientes">
                            <FaUserTie className="icon" />
                            Clientes Potenciales
                        </Link>
                    </li>
                    <li>
                        <Link to="/marketing">
                            <FaBullhorn className="icon" />
                            Marketing
                        </Link>
                    </li>
                    <li>
                        <Link to="/planificacion">
                            <FaClock className="icon" />
                            Planificación
                        </Link>
                    </li>
                    <li>
                        <Link to="/ventas">
                            <FaChartBar className="icon" />
                            Ventas
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <Greeting username={username} />
                <Link to="/login" className="logout">
                    <FaSignOutAlt className="icon" />
                    Salir
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
