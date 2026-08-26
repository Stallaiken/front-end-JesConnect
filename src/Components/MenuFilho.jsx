import "../css/MenuFilho.css";
import Trofeu_Ranking from "../assets/Trofeu_Ranking.png"
import Queimado from "../assets/Queimado.png"
import Bola_de_volei from "../assets/Bola_de_volei.png"
import Bola_de_Futebol from "../assets/Bola_de_Futebol.png"
import Campo from "../assets/Campo.png"
function MenuFilho() {
  return (
    <div className="Menu-mais-opcoes">
      <nav className="menu-nav">
        <button className="btn-menu-item">
          
          RANKING
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
    </div>
  );
}

export default MenuFilho;