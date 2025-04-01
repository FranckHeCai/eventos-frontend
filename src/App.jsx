import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./index.css";
import axios from "axios";


function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const user = response.data;

      onLogin(user); // Aquí puedes pasar token si tu API lo devuelve
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      alert("Email o contraseña incorrectos");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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


function Register(onLogin ) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Verifica si ya existe un usuario con ese email o username
      const { data: users } = await axios.get("http://localhost:3000/user");

      const usernameExists = users.some((user) => user.username === username);
      const emailExists = users.some((user) => user.email === email);

      if (usernameExists || emailExists) {
        alert("El usuario o correo ya están registrados");
        return;
      }

      const newUser = { username, password, email };

      const response = await axios.post("http://localhost:3000/user", newUser);
      console.log("Usuario registrado:", response.data);

        // ✅ PASO 2: Aquí justo después del registro
    localStorage.setItem("user", JSON.stringify(response.data));
    onLogin(response.data); // << ESTE es el paso clave
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
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Registrarse</button>
        </form>
      )}
    </div>
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

import { useParams } from "react-router-dom";

function EventDetail() {
  const { id } = useParams();
  const [item, setItem] = useState("");
  const [event, setEvent] = useState(null);
  const [items, setItems] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const selectedEvent = events[parseInt(id)];
    if (selectedEvent) {
      setEvent(selectedEvent);
      setItems(selectedEvent.items || []);
    }
  }, [id]);

  const handleAddItem = () => {
    const updatedItems = [...items, { user: user?.username, item }];
    setItems(updatedItems);
    const events = JSON.parse(localStorage.getItem("events")) || [];
    events[parseInt(id)].items = updatedItems;
    localStorage.setItem("events", JSON.stringify(events));
    setItem("");
  };

  if (!event) {
    return <p>Evento no encontrado</p>;
  }

  return (
    <div>
      <h2>{event.title}</h2>
      <h3>Qué voy a llevar</h3>
      <input type="text" placeholder="Añadir algo" value={item} onChange={(e) => setItem(e.target.value)} />
      <button onClick={handleAddItem}>Añadir</button>
      <ul>
        {items.map((itemObj, index) => (
          <li key={index}>{itemObj.user}: {itemObj.item}</li>
        ))}
      </ul>
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
          <li key={index}>
            {event.title} - {event.date} en {event.location}
            <button onClick={() => window.location.href = `/events/${index}`}>Ver Detalle</button>
          </li>
        ))}
      </ul>
      <button onClick={() => window.location.href = "/new-event"}>Crear Nuevo Evento</button>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <p>© {new Date().getFullYear()} LOS OPRESORES | 
        <a href="/terms"> Términos</a> | 
        <a href="/privacy"> Privacidad</a>
      </p>
      <p>¡Síguenos en redes sociales!</p>
    </footer>
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
      <div id="app">
      <Navbar user={user} onLogout={handleLogout} />
       {/* Slider de imágenes */}
       <div className="slider-container">
        <div className="slider">
          <div className="slide">
            <img src="https://template.canva.com/EAGHLgkJxxE/1/0/1600w-a1LNJIiOVXM.jpg" alt="Slide 1" />
          </div>
          <div className="slide">
            <img src="https://template.canva.com/EAF6dYsvIJs/5/0/1600w-RshTdVtF_mo.jpg" alt="Slide 2" />
          </div>
          <div className="slide">
            <img src="https://template.canva.com/EAGM4dxaMkg/1/0/1600w-VFCf3WuPF0s.jpg" />
          </div>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/profile" element={<Profile user={user} setUser={handleLogin} />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/new-event" element={<NewEvent />} />
        <Route path="/events/:id" element={<EventDetail />} />
      </Routes>
      </div>
      
      <Footer />
    </Router>
  );
}


export default App;
