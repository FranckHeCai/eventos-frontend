// components/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data: users } = await axios.get("http://localhost:3000/user");
      const usernameExists = users.some((user) => user.username === username);
      const emailExists = users.some((user) => user.email === email);

      if (usernameExists || emailExists) {
        alert("El usuario o correo ya están registrados");
        return;
      }

      const newUser = { username, password, email };
      const response = await axios.post("http://localhost:3000/user", newUser);
      localStorage.setItem("user", JSON.stringify(response.data));
      onLogin(response.data);
      navigate("/profile");

    } catch (error) {
      console.error("Error registrando usuario:", error);
      alert("No se pudo registrar el usuario");
    }
  };

  return (
    <div>
      {localStorage.getItem("user") ? (
        <p>Ya estás registrado e iniciado sesión.</p>
      ) : (
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Registrarse</button>
        </form>
      )}
    </div>
  );
}

export default Register;