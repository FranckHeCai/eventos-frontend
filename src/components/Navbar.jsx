import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#f0f0f0" }}>
      <div className="div-nav">
        <Link to="/">Inicio</Link> | <Link to="/new-event">Nuevo Evento</Link> | <Link to="/events">Eventos</Link> | <Link to="/profile">Perfil</Link>
      </div>
      <div className="div-nav2">
        {user ? (
          <>
            <span style={{ marginRight: "10px" }}>Bienvenido, {user.username}</span>
            <button onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : (
          <Link to="/">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
