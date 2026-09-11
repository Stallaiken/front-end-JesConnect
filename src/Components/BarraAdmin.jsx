import { useLocation, useNavigate } from "react-router-dom";
import "../css/BarraAdmin.css";

function BarraAdmin({ acaoSelecao, onIniciarSelecao }) {
  const location = useLocation();
  const navigate = useNavigate();
  const rotaAtual = location.pathname.toLowerCase();

  const eRotaPartidas =
    rotaAtual.includes("horarios") ||
    rotaAtual.includes("partida") ||
    rotaAtual.includes("administrativo") ||
    rotaAtual.includes("jogo");

  const eRotaTimes = rotaAtual.includes("time");
  const eRotaRanking = rotaAtual.includes("ranking");

  const selecionarPara = (acao) => {
    if (typeof onIniciarSelecao === "function") onIniciarSelecao(acao);
  };

  return (
    <div className="admin-painel-bar">
      {eRotaPartidas && (
        <div className="admin-secao-grupo">
          <h4 className="admin-secao-titulo">GERENCIADOR DE PARTIDAS</h4>
          <div className="admin-botoes-container">
            <button
              type="button"
              className="admin-btn-acao"
              onClick={() => navigate("/adicionar-jogo")}
            >
              CRIAR PARTIDA
            </button>

            <button
              type="button"
              className={`admin-btn-acao ${acaoSelecao === "editar" ? "ativo" : ""}`}
              onClick={() => selecionarPara("editar")}
            >
              {acaoSelecao === "editar" ? "CANCELAR EDIÇÃO" : "EDITAR PARTIDA"}
            </button>

            <button type="button" className={`admin-btn-acao ${acaoSelecao === "deletar" ? "ativo" : ""}`} onClick={() => selecionarPara("deletar")}>
              DELETAR PARTIDA
            </button>
            <button type="button" className={`admin-btn-acao ${acaoSelecao === "comecar" ? "ativo" : ""}`} onClick={() => selecionarPara("comecar")}>
              COMEÇAR
            </button>
            <button
              type="button"
              className={`admin-btn-acao ${acaoSelecao === "finalizar" ? "ativo" : ""}`}
              onClick={() => selecionarPara("finalizar")}
            >
              FINALIZAR
            </button>
          </div>
        </div>
      )}

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
            <button
              type="button"
              className="admin-btn-acao"
              onClick={() => navigate("/editar-time")}
            >
              EDITAR TIME
            </button>
            <button
              type="button"
              className="admin-btn-acao"
              onClick={() => navigate("/deletar-time")}
            >
              DELETAR TIME
            </button>
          </div>
        </div>
      )}

      {eRotaRanking && (
        <div className="admin-secao-grupo">
          <h4 className="admin-secao-titulo">GERENCIADOR DE RANKING</h4>
          <div className="admin-botoes-container">
            <button type="button" className="admin-btn-acao">
              EDITAR PONTOS
            </button>
          </div>
        </div>
      )}

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
