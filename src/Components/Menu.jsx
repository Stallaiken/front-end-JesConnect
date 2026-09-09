import "../css/Menu.css";
import Sesi_Logo from "../assets/Sesi_Logo.png";
import {Link} from "react-router-dom";

function Menu() {
  return (
    <div className="menu">
    <nav>
      <Link to="/Horarios">Ao ViVO</Link>
      <Link to="/Ranking">Ranking</Link>
      <Link to="/Historico">Histórico</Link>
      <Link to="/Administrativo">Admin</Link>
    </nav>

      <div className="logo-sesi-menu">
        <img src={Sesi_Logo} alt="Logo SESI" />
      </div>
    </div>
  );
}

export default Menu;