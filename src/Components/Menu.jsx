import "../css/Menu.css";
import Sesi_Logo from "../assets/Sesi_Logo.png";

function Menu({ aoAbrir }) {
  return (
    <div className="menu">
      <div className="icone-mais-opcoes">
        <button 
          className="btn-mais-opcoes" 
          onClick={() => {
            aoAbrir(prev => !prev);
          }}
        >
          <div className="tres-tracinhos"></div>
        </button>
      </div>

      <div className="logo-sesi-menu">
        <img src={Sesi_Logo} alt="Logo SESI" />
      </div>
    </div>
  );
}

export default Menu;