// components/EventDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function EventDetail() {
  const { id } = useParams();
  console.log(id);
  const [event, setEvent] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, ingredientsRes] = await Promise.all([
          axios.get(`http://localhost:3000/events/${id}`),
          axios.get("http://localhost:3000/ingredients"),
        ]);

        const eventWithItems = { ...eventRes.data, items: eventRes.data.items || [] };

        setEvent(eventWithItems);
        setIngredients(ingredientsRes.data);
      } catch (error) {
        console.error("Error cargando evento o ingredientes:", error);
      }
    };

    fetchData();
  }, [id]);

  const selectIngredient = (ingredient) => {
    const foundIngredient = selectedItems.find((i) => i.id === ingredient.id)
    setSelectedIngredient(foundIngredient);
    return foundIngredient;
  }

  const handleCheckboxChange = (ingredient) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === ingredient.id);
      if (exists) {
        return prev.filter((i) => i.id !== ingredient.id);
      } else {
        return [...prev, { id: ingredient.id, name: ingredient.name, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (ingredientId, value) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.id === ingredientId ? { ...i, quantity: parseInt(value) || 1 } : i
      )
    );
    console.log(selectedItems);
  };

  const handleSubmit = async (ingredientId, quantity) => {
    try {
          axios.post("http://localhost:3000/eventIngredients", {
            eventId: id,
            ingredientId: ingredientId,
            quantity:quantity,
          })
    
  
      alert("Ingredientes añadidos correctamente");
      setSelectedItems([]);
    } catch (error) {
      console.error("Error al guardar ingredientes:", error);
      alert("Hubo un error al guardar los ingredientes");
    }
  };

  if (!event || ingredients.length === 0) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{event.name}</h2>
      <h3>Selecciona qué vas a llevar</h3>
      <form onSubmit={(e) => { 
        e.preventDefault()
         handleSubmit()
          console.log(e.target.ingredient.id, e.target.ingredient.name)}}>
        {ingredients.map((ingredient) => {
          const selected = selectedItems.find((i) => i.id === ingredient.id);
          // const selected = selectIngredient(ingredient);
          return (
            <div key={ingredient.id} style={{ marginBottom: "0.5em" }}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={() => handleCheckboxChange(ingredient)}
                />
                {ingredient.name}
              </label>
              {selected && (
                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={selected.quantity}
                  onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                  style={{ marginLeft: "1em", width: "60px" }}
                />
              )}
            </div>
          );
        })}
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default EventDetail;
