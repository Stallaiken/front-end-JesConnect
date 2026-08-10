import {Link} from "react-router-dom";
import "../css/Menu.css"
function Menu() {
  return (
    <nav className="menu">
      <ul className="menu-list">
        <Link to="/"><li>Home</li></Link>
        <Link to="/Visitar"><li>Visitar</li></Link>
        <Link to="/Administrativo"><li>Administrativo</li></Link>
      </ul>
    </nav>
  );
} 
export default Menu;