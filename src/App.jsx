import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find((user) => user.username === username);
    if (userExists) {
      onLogin(userExists);
      navigate("/profile");
    } else {
      alert("Usuario no registrado");
    }
  };

  return (
    <div>
      {localStorage.getItem("user") ? (
        <p>Ya has iniciado sesión.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
          <button type="submit">Iniciar sesión</button>
          <p>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
        </form>
      )}
    </div>
  );
}

function Register({ onLogin }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.username === username)) {
      alert("El usuario ya existe");
      return;
    }
    const newUser = { username };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    onLogin(newUser);
    navigate("/profile");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button type="submit">Registrarse</button>
    </form>
  );
}

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
    <div>
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

function NewEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [participants, setParticipants] = useState("");

  const handleCreate = () => {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const newEvent = { title, date, location, participants: participants.split(",") };
    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
    setTitle("");
    setDate("");
    setLocation("");
    setParticipants("");
    alert("Evento creado exitosamente");
  };

  return (
    <div>
      <h2>Nuevo Evento</h2>
      <input type="text" placeholder="Nombre del evento" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="text" placeholder="Lugar del evento" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="text" placeholder="Participantes (separados por coma)" value={participants} onChange={(e) => setParticipants(e.target.value)} />
      <button onClick={handleCreate}>Crear Evento</button>
    </div>
  );
}

function EventList() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);
  return (
    <div>
      <h2>Listado de Eventos</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.title} - {event.date} en {event.location}</li>
        ))}
      </ul>
      <button onClick={() => window.location.href = "/new-event"}>Crear Nuevo Evento</button>
    </div>
  );
}

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
        <Route path="/events" element={<EventList />} />
        <Route path="/new-event" element={<NewEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
