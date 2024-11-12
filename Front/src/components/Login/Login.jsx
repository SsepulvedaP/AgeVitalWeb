import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from 'services/loginUser';  // Asegúrate de que la ruta sea correcta
import "./Login.css";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Llamamos al servicio loginUser con los datos del formulario
    const token = await loginUser(email, password);
    if (token) {
      // Guardamos el token en el localStorage o en cualquier lugar adecuado
      localStorage.setItem('access_token', token);
      console.log(localStorage.getItem('access_token'));

      // Redirigimos al usuario a la página principal o alguna otra
      navigate("/"); // Puedes cambiar esto a la ruta que desees
    } else {
      // Maneja error de login (por ejemplo, mostrando un mensaje)
      alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
    window.location.reload();
  };

  return (
    <div className="login-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <ExitToAppRoundedIcon />
      </button>
      <div className="login-form">
        <h2>Inicio de Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electronico</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
