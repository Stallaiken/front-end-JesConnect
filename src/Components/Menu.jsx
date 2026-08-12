import {Link} from "react-router-dom";
import "../css/Menu.css"
function Menu() {
  return (
    <nav className="menu">
       <p>SESI Esportes</p>
      <ul className="menu-list">
        <Link to="/"><li>Home</li></Link>
        <Link to="/Visitante"><li>Visitante</li></Link>
        <Link to="/Administrativo"><li>Administrativo</li></Link>
      </ul>
    </nav>
  );
} 
export default Menu;