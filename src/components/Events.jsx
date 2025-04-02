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
import {useState, useEffect} from 'react';

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

