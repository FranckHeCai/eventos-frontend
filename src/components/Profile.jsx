// components/Profile.jsx
import { useState } from "react";

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

export default Profile;
