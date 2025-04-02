import { useState, useEffect } from "react";
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
      <input
        type="text"
        placeholder="Añadir algo"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <button onClick={handleAddItem}>Añadir</button>
      <ul>
        {items.map((itemObj, index) => (
          <li key={index}>{itemObj.user}: {itemObj.item}</li>
        ))}
      </ul>
    </div>
  );
}

export default EventDetail;