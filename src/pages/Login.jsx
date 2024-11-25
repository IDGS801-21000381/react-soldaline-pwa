import React from 'react';
import { useNavigate } from 'react-router-dom'; // Navegación de React Router
import '../style/login.css';

const Login = () => {
    const navigate = useNavigate(); // Hook para navegar entre páginas

    const handleLogin = (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario
        navigate('/dashboard'); // Redirige a la página de Dashboard
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <img src="/Logosoldaline.png" alt="Logo" className="login-logo" />
                    <h2 className="login-title">Iniciar Sesión</h2>
                </div>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-container">
                        <input type="text" id="usuario" className="login-input" required />
                        <label htmlFor="usuario" className="login-label">Usuario</label>
                    </div>
                    <div className="input-container">
                        <input type="password" id="contraseña" className="login-input" required />
                        <label htmlFor="contraseña" className="login-label">Contraseña</label>
                    </div>
                    <button type="submit" className="login-button">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
