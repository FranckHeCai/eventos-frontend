import { useEffect, useState } from "react";

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

export default EventList;