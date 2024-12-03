import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Navegación de React Router
import Swal from "sweetalert2"; // Importa SweetAlert
import "../style/login.css";

const Login = () => {
  const navigate = useNavigate(); // Hook para navegar entre páginas
  const [correo, setCorreo] = useState(""); // Estado para el correo
  const [contrasenia, setContrasenia] = useState(""); // Estado para la contraseña

  // Lista de usuarios permitidos (almacenados localmente)
  const usuariosPermitidos = [
    { correo: "angel@mail.com", contrasenia: "123456" },
    { correo: "juan@mail.com", contrasenia: "Pass123" },
    { correo: "pedro@mail.com", contrasenia: "pedro12334" },
    { correo: "roberto@mail.com", contrasenia: "roberto123" },
  ];

  const handleLogin = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    // Validación de campos vacíos
    if (!correo || !contrasenia) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, completa ambos campos.",
      });
      return;
    }

    // Buscar si el usuario existe en la lista
    const usuarioValido = usuariosPermitidos.find(
      (user) => user.correo === correo && user.contrasenia === contrasenia
    );

    if (usuarioValido) {
      // Usuario autenticado
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido a tu Dashboard.",
      });

      // Guardar usuario en localStorage (opcional)
      localStorage.setItem("usuario", JSON.stringify(usuarioValido));

      // Redirigir al Dashboard
      navigate("/dashboard");
    } else {
      // Usuario no válido
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "El correo o la contraseña son incorrectos. Por favor, vuelve a intentarlo.",
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
            <label htmlFor="usuario" className="login-label">
              Usuario
            </label>
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
            <label htmlFor="contraseña" className="login-label">
              Contraseña
            </label>
          </div>

          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
