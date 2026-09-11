import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import BarraAdmin from "./BarraAdmin";
import "../css/Menu.css";
import Sesi_Logo from "../assets/Sesi_Logo.png";

function Menu() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminBar, setShowAdminBar] = useState(false);
  const navigate = useNavigate();

  const checarAdminNoBanco = useCallback(async () => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {
      setIsAdmin(false);
      return;
    }

    // Busca no banco se este usuário específico é admin
    const { data, error } = await supabase
      .from("usuarios")
      .select("is_admin")
      .eq("usuario", usuarioLogado)
      .maybeSingle();

    if (!error && data?.is_admin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    checarAdminNoBanco();

    // Ouve quando o login é efetuado para reavaliar no banco imediatamente
    window.addEventListener("admin-status-change", checarAdminNoBanco);
    return () => {
      window.removeEventListener("admin-status-change", checarAdminNoBanco);
    };
  }, [checarAdminNoBanco]);

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
          <Link to="/Administrativo" onClick={handleAdminClick}>
            Admin
          </Link>
        </nav>

        <div className="logo-sesi-menu">
          <img src={Sesi_Logo} alt="Logo SESI" />
        </div>
      </div>

      {isAdmin && showAdminBar && <BarraAdmin />}
    </header>
  );
}

export default Menu;