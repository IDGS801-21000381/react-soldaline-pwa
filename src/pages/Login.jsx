import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Navegación de React Router
import Swal from 'sweetalert2'; // Importa SweetAlert
import '../style/login.css';

const Login = () => {
    const navigate = useNavigate(); // Hook para navegar entre páginas
    const [correo, setCorreo] = useState(''); // Estado para el correo
    const [contrasenia, setContrasenia] = useState(''); // Estado para la contraseña
    const [error, setError] = useState(''); // Estado para mostrar el error

  
    const handleLogin = async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario

        // Validación de campos vacíos
        if (!correo || !contrasenia) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, completa ambos campos.',
            });
            return;
        }

        // Realizar la solicitud de login
        try {
         // const response = await fetch('http://bazar20241109230927.azurewebsites.net/api/Usuario/login', {
            const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/Usuario/login', {
   
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Correo: correo,
                    Contrasenia: contrasenia,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Si el login es exitoso, redirige al dashboard
                // Imprime la información del usuario en consola
                console.log('Usuario autenticado exitosamente:', data);

                // Puedes almacenar la información del usuario en un estado global o en el almacenamiento local si lo necesitas
                // Por ejemplo, en localStorage para acceso rápido en otras partes de la app:
                localStorage.setItem('usuario', JSON.stringify(data));

                navigate('/dashboard'); // Redirige a la página de Dashboard
            } else {
                // Si la respuesta no es exitosa, muestra el error
                Swal.fire({
                    icon: 'error',
                    title: 'Error de autenticación',
                    text: 'El correo o la contraseña son incorrectos. Si el problema persiste, por favor contacte al administrador.',
                });
            }
        } catch (error) {
            // Maneja cualquier error de la solicitud
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Hubo un error al procesar su solicitud. Intente nuevamente más tarde.',
            });
        }
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
                        <input
                            type="text"
                            id="usuario"
                            className="login-input"
                            required
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                        <label htmlFor="usuario" className="login-label">Usuario</label>
                    </div>
                    <div className="input-container">
                        <input
                            type="password"
                            id="contraseña"
                            className="login-input"
                            required
                            value={contrasenia}
                            onChange={(e) => setContrasenia(e.target.value)}
                        />
                        <label htmlFor="contraseña" className="login-label">Contraseña</label>
                    </div>

                    <button type="submit" className="login-button">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
