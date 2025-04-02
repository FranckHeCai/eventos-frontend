// components/NewEvent.jsx
import { useState } from "react";

function NewEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleCreate = () => {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const newEvent = {
      title,
      date,
      location,
    };
    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
    setTitle("");
    setDate("");
    setLocation("");
    alert("Evento creado exitosamente");
  };

  return (
    <div>
      <h2>Nuevo Evento</h2>
      <input type="text" placeholder="Nombre del evento" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="text" placeholder="Lugar del evento" value={location} onChange={(e) => setLocation(e.target.value)} />
      <button onClick={handleCreate}>Crear Evento</button>
    </div>
  );
}

export default NewEvent;