import "../css/MenuFilho.css";
import { useNavigate } from "react-router-dom";

function MenuFilho({ aoAbrir }) {
  const navigate = useNavigate();

  return (
    <div className="Menu-mais-opcoes">
      <nav className="menu-nav">
        <button
          className="btn-menu-item"
          onClick={() => {
            aoAbrir(false);
            navigate("/Ranking");
          }}
        >
          RANKING
        </button>
        <button
          className="btn-menu-item"
          onClick={() => {
            aoAbrir(false);
            navigate("/Historico");
          }}
        >
          HISTORICO
        </button>
        <button
          className="btn-menu-item"
          onClick={() => {
            aoAbrir(false);
            navigate("/Horarios");
          }}
        >
          HORARIOS
        </button>
        <button
          className="btn-menu-item"
          onClick={() => {
            aoAbrir(false);
            navigate("modalidade/Futset");
          }}
        >
          FUTSETE
        </button>
        <button
          className="btn-menu-item"
          onClick={() => {
            aoAbrir(false);
            navigate("/modalidade/Futsal");
          }}
        >
          FUTSAL
        </button>
        <button
          className="btn-menu-item"
          onClick={() => {
            aoAbrir(false);
            navigate("/modalidade/Queimado");
          }}
        >
          QUEIMADO
        </button>
        <button
          className="btn-menu-item"
          onClick={() => {
            aoAbrir(false);
            navigate("/modalidade/Volei");
          }}
        >
          VOLLEI
        </button>
      </nav>
      <a
  className="btn-menu-item"
  href="\public\Regulamento-JES-2026.pdf"
  download="Regulamento-JES-2026.pdf"
>
  Baixar Regulamento
</a>
      <button
        className="Administrativo-menu"
        onClick={() => {
          navigate("/Administrativo");
          aoAbrir(false);
        }}
      >
        ADMINISTRATIVO
      </button>
    </div>
  );
}

export default MenuFilho;
