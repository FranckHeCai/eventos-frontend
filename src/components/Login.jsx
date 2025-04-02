import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Basic ${btoa(username + ":" + password)}`,
        },
      });

      const user = response.data.user;
      onLogin(user);
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      alert("Correo o contraseña incorrectos");
    }
  };

  if (user) {
    return (
      <div>
        <p>Ya has iniciado sesión como <strong>{user.username}</strong>.</p>
        <button onClick={() => navigate("/profile")}>Ir al perfil</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Iniciar sesión</button>
      <p>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
    </form>
  );
}

export default Login;