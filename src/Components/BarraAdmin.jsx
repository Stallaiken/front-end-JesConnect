import { useLocation, useNavigate } from "react-router-dom";
import "../css/BarraAdmin.css";

function BarraAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const rotaAtual = location.pathname.toLowerCase();

  // Verifica em qual página o usuário está
  const eRotaPartidas = rotaAtual.includes("horarios") || rotaAtual.includes("partida");
  const eRotaTimes = rotaAtual.includes("times");
  const eRotaRanking = rotaAtual.includes("ranking");

  return (
    <div className="admin-painel-bar">
      {/* GERENCIADOR DE PARTIDAS - Exibido apenas em Horários/Partidas */}
      {eRotaPartidas && (
        <div className="admin-secao-grupo">
          <h4 className="admin-secao-titulo">GERENCIADOR DE PARTIDAS</h4>
          <div className="admin-botoes-container">
            <button type="button" className="admin-btn-acao">CRIAR PARTIDA</button>
            <button type="button" className="admin-btn-acao">EDITAR PARTIDA</button>
            <button type="button" className="admin-btn-acao">DELETAR PARTIDA</button>
            <button type="button" className="admin-btn-acao">COMEÇAR</button>
            <button type="button" className="admin-btn-acao">FINALIZAR</button>
          </div>
        </div>
      )}

      {/* GERENCIADOR DE TIMES - Exibido apenas em Times */}
      {eRotaTimes && (
        <div className="admin-secao-grupo">
          <h4 className="admin-secao-titulo">GERENCIADOR DE TIMES</h4>
          <div className="admin-botoes-container">
            <button 
              type="button" 
              className="admin-btn-acao"
              onClick={() => navigate("/adicionarTime")}
            >
              CRIAR TIME
            </button>
            <button type="button" className="admin-btn-acao">EDITAR TIME</button>
            <button type="button" className="admin-btn-acao">DELETAR TIME</button>
          </div>
        </div>
      )}

      {/* GERENCIADOR DE RANKING - Exibido apenas em Ranking */}
      {eRotaRanking && (
        <div className="admin-secao-grupo">
          <h4 className="admin-secao-titulo">GERENCIADOR DE RANKING</h4>
          <div className="admin-botoes-container">
            <button type="button" className="admin-btn-acao">EDITAR PONTOS</button>
          </div>
        </div>
      )}

      {/* GERENCIADOR DE MODALIDADES */}
      <div className="admin-secao-grupo">
        <h4 className="admin-secao-titulo">GERENCIADOR DE MODALIDADES</h4>
        <div className="admin-botoes-container">
          <button 
            type="button" 
            className="admin-btn-acao"
            onClick={() => navigate("/criarModalidade")}
          >
            GERENCIAR MODALIDADES
          </button>
        </div>
      </div>
    </div>
  );
}

export default BarraAdmin;