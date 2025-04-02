// components/NewEvent.jsx
import { useState } from "react";
import axios from "axios";

function NewEvent() {
  const [name, setname] = useState("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    try {
      const newEvent = {
        name,
        date,
        place,
        description,
        items: [],
      };
      await axios.post("http://localhost:3000/events", newEvent);
      setname("");
      setDate("");
      setPlace("");
      setDescription("");
      alert("Evento creado exitosamente");
    } catch (error) {
      console.error("Error al crear evento:", error);
      alert("No se pudo crear el evento");
    }
  };

  return (
    <div>
      <h2>Nuevo Evento</h2>
      <input type="text" placeholder="Nombre del evento" value={name} onChange={(e) => setname(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="text" placeholder="Lugar del evento" value={place} onChange={(e) => setPlace(e.target.value)} />
      <textarea placeholder="Descripción del evento" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
      <button onClick={handleCreate}>Crear Evento</button>
    </div>
  );
}

export default NewEvent;
