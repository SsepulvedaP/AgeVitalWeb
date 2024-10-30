import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("ID:", id, "Password:", password);
  };

  return (
    <div className="login-container">
      <button className="back-button" onClick={() => navigate(-1)}><ExitToAppRoundedIcon  /></button>
      <div className="login-form">
        <h2>Inicio de Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
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
