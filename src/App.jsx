import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

function Register({ onLogin }) {
  const [username, setUsername] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button type="submit">Registrarse</button>
    </form>
  );
}

function Profile({ user, setUser }) {
  const [name, setName] = useState(user?.username || "");
  const handleSave = () => {
    setUser({ username: name });
    localStorage.setItem("user", JSON.stringify({ username: name }));
  };
  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSave}>Guardar</button>
    </div>
  );
}

function NewEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const handleCreate = () => {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const newEvent = { title, date };
    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
    setTitle("");
    setDate("");
  };
  return (
    <div>
      <h2>Crear Evento</h2>
      <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button onClick={handleCreate}>Crear</button>
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
      <h2>Lista de Eventos</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.title} - {event.date}</li>
        ))}
      </ul>
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
        <Route path="/new-event" element={<NewEvent />} />
        <Route path="/events" element={<EventList />} />
      </Routes>
    </Router>
  );
}

export default App;
