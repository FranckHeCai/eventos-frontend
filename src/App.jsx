import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import EventList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import NewEvent from "./components/NewEvent";
import "./index.css";

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
      <div className="slider-container">
        <div className="slider">
          <div className="slide">
            <img src="https://template.canva.com/EAGHLgkJxxE/1/0/1600w-a1LNJIiOVXM.jpg" alt="Slide 1" />
          </div>
          <div className="slide">
            <img src="https://template.canva.com/EAF6dYsvIJs/5/0/1600w-RshTdVtF_mo.jpg" alt="Slide 2" />
          </div>
          <div className="slide">
            <img src="https://template.canva.com/EAGM4dxaMkg/1/0/1600w-VFCf3WuPF0s.jpg" alt="Slide 3" />
          </div>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/profile" element={<Profile user={user} setUser={handleLogin} />} />
        <Route path="/new-event" element={<NewEvent />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />

      </Routes>
    </Router>
  );
}

export default App;