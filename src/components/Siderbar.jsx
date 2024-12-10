import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate para redirigir al login
import Swal from 'sweetalert2'; // Importa SweetAlert
import {
    FaTachometerAlt,
    FaUserTie,
    FaBullhorn,
    FaClock,
    FaChartBar,
    FaBuilding,
    FaComments,
    FaMoneyBillWave,
    FaBars,
    FaSignOutAlt,
} from 'react-icons/fa';
import Logo from './Logo';
import Greeting from './Greeting';
import '../style/Sidebar.css';

const Sidebar = ({ username }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // Usamos useNavigate para redirigir al login

    const toggleSidebar = () => setIsOpen(!isOpen);

    // Función para cerrar sesión
    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Quieres cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir',
        }).then((result) => {
            if (result.isConfirmed) {
                // Borrar el token y la información del usuario de localStorage
                localStorage.removeItem('usuario');
                localStorage.removeItem('token'); // También elimina el token si lo guardas en localStorage

                // Redirigir al login
                navigate('/login'); // Redirige a la página de login

                Swal.fire(
                    'Sesión cerrada',
                    'Has cerrado sesión exitosamente.',
                    'success'
                );
            }
        });
    };

    return (
        <>
            {/* Botón de toggle */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <FaBars />
            </button>

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? '' : 'closed'}`}>
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
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/clientes">
                                <FaUserTie className="icon" />
                                <span>Clientes Potenciales</span>
                            </Link>
              </li>
              <li>
                            <Link to="/Historial">
                                <FaUserTie className="icon" />
                                <span>Historial de comunicacion</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/marketing">
                                <FaBullhorn className="icon" />
                                <span>Marketing</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/planificacion">
                                <FaClock className="icon" />
                                <span>Planificación</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/ventas">
                                <FaChartBar className="icon" />
                                <span>Ventas</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/empresa">
                                <FaBuilding className="icon" />
                                <span>Empresa</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/Comentarios por cliente">
                                <FaComments className="icon" />
                                <span>Comentarios</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/Cuentas por pagar">
                                <FaMoneyBillWave className="icon" />
                                <span>Cuentas por Pagar</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <Greeting username={username} />
                    <button className="logout" onClick={handleLogout}>
                        <FaSignOutAlt className="icon" />
                        <span>Salir</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
