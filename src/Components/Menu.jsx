import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import BarraAdmin from "./BarraAdmin";
import "../css/Menu.css";
import Sesi_Logo from "../assets/Sesi_Logo.png";

function Menu({ acaoSelecao, onIniciarSelecao }) {



  const [isAdmin, setIsAdmin] = useState(false); //Verifica se é administrador tirar quando for enviar para o professor

  const [showAdminBar, setShowAdminBar] = useState(false);
  const navigate = useNavigate();


  const checarAdminStorage = useCallback(() => {
    const statusAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(statusAdmin);
    if (!statusAdmin) setShowAdminBar(false);
  }, []);

  useEffect(() => {
    checarAdminStorage();

    // Escuta o evento disparado no login/logout (Administrativo.jsx) e mudanças de aba
    window.addEventListener("admin-status-change", checarAdminStorage);
    window.addEventListener("storage", checarAdminStorage);

    return () => {
      window.removeEventListener("admin-status-change", checarAdminStorage);
      window.removeEventListener("storage", checarAdminStorage);
    };
  }, [checarAdminStorage]);

  const handleAdminClick = (e) => {
    if (isAdmin) {
      e.preventDefault();
      setShowAdminBar((prev) => !prev);
    } else {
      navigate("/Administrativo");
    }
  };

  return (
    <header className="menu-container-header">
      <div className="menu">
        <nav>
          <Link to="/Horarios">Ao VIVO</Link>
          <Link to="/Ranking">Ranking</Link>
          <Link to="/Historico">Histórico</Link>
          <Link to="/Times">Times</Link>
          <Link to="/Chaveamento">Chaveamento</Link>
          <Link to="/Administrativo" onClick={handleAdminClick}>
            Admin
          </Link>
        </nav>

        <div className="logo-sesi-menu">
          <img src={Sesi_Logo} alt="Logo SESI" />
        </div>
      </div>

      {isAdmin && showAdminBar && (
        <BarraAdmin
          acaoSelecao={acaoSelecao}
          onIniciarSelecao={onIniciarSelecao}
        />
      )}
    </header>
  );
}

export default Menu;
