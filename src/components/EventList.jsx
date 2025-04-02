// components/EventList.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        alert("No se pudieron cargar los eventos");
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Listado de Eventos</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <strong>{event.title}</strong> - {event.date} en {event.location}
            <p>{event.description}</p>
            <button onClick={() => window.location.href = `/events/${event.id}`}>Ver Detalle</button>
          </li>
        ))}
      </ul>
      <button onClick={() => window.location.href = "/new-event"}>Crear Nuevo Evento</button>
    </div>
  );
}

export default EventList;
