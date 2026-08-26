import "../css/MenuFilho.css";
import { useNavigate } from "react-router-dom";


function MenuFilho({aoAbrir}) {
 const navigate = useNavigate()

  return (
    <div className="Menu-mais-opcoes">
      <nav className="menu-nav">
        <button className="btn-menu-item">
          RANKING
        </button>
        <button className="btn-menu-item">
            HISTORICO
        </button>
        <button className="btn-menu-item" onClick={()=>{
          aoAbrir(false)
          navigate("/Horarios")
        }}>
          HORARIOS
        </button>
        <button className="btn-menu-item">
          FUTSETE
        </button>
        <button className="btn-menu-item">
          FUTSAL
        </button>
        <button className="btn-menu-item">
          QUEIMADO
        </button>
        <button className="btn-menu-item">
          VOLLEI
        </button>
      </nav>
      <button className="Administrativo-menu" onClick={()=>{
        navigate("/Administrativo")
        aoAbrir(false)
      }}>ADMINISTRATIVO</button>
    </div>
  );
}

export default MenuFilho;