import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import "./index.css";

// ----------------------------
// LOGIN
// ----------------------------
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] =  useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password)
    console.log(btoa(username + ":" + password))
    try {
      const response = await axios.post("http://localhost:3000/auth/login", 
        {
        username,
        password,
      }, {
        
      headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${btoa(username + ":" + password)}`
    },
      })
      console.log(response.data.user)
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

// ----------------------------
// REGISTER
// ----------------------------
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
      onLogin(response.data); // <- aquí es crucial
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

// ----------------------------
// PROFILE
// ----------------------------
function Profile({ user, setUser }) {
  const [name, setName] = useState(user?.name || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [birthdate, setBirthdate] = useState(user?.birthdate || "");
  const [residence, setResidence] = useState(user?.residence || "");
  const [photo, setPhoto] = useState(user?.photo || "");

  const handleSave = () => {
    const updatedUser = { ...user, name, lastname, birthdate, residence, photo };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Perfil actualizado correctamente");
  };

  return (
    <div className="perfil">
      <h2>Perfil de Usuario</h2>
      <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Apellidos" value={lastname} onChange={(e) => setLastname(e.target.value)} />
      <input type="date" placeholder="Fecha de nacimiento" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
      <input type="text" placeholder="Lugar de residencia" value={residence} onChange={(e) => setResidence(e.target.value)} />
      <input type="file" onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))} />
      {photo && <img src={photo} alt="Foto de perfil" style={{ width: 100, height: 100 }} />}
      <button onClick={handleSave}>Guardar</button>
    </div>
  );
}

// ----------------------------
// APP
// ----------------------------
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/profile" element={<Profile user={user} setUser={handleLogin} />} />
        {/* agrega más rutas si las necesitas */}
      </Routes>
    </Router>
  );
}

export default App;