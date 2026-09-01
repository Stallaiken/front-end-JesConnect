import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Horarios.css";
import { MOCK_JOGOS } from "../utils/mockJogos";

function Horarios() {
  const navigate = useNavigate();
  const [jogos, setJogos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuAdminAberto, setMenuAdminAberto] = useState(false);

  useEffect(() => {
    setJogos(MOCK_JOGOS);
    const adminLogado = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminLogado);
  }, []);

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">Horários de Início</h1>
      </div>

      <div className="lista-confrontos">
        {jogos.map((jogo) => (
          <div key={jogo.id} className="card-confronto">
            <span className="modalidade-titulo">{jogo.modalidade}</span>
            <div className="conteudo-confronto">
              <div className="time-box">
                <span className="bandeira">{jogo.timeA.bandeira}</span>
                <span className="nome-time">{jogo.timeA.nome}</span>
              </div>
              <div className="horario-pill">{jogo.horario}</div>
              <div className="time-box">
                <span className="bandeira">{jogo.timeB.bandeira}</span>
                <span className="nome-time">{jogo.timeB.nome}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Menu Flutuante Único para o Admin */}
      {isAdmin && (
        <div className="fab-container">
          {menuAdminAberto && (
            <div className="fab-options">
              <button className="fab-sub-button btn-texto" title="Finalizar Jogo">
                FINALIZAR
              </button>

              <button className="fab-sub-button btn-texto" title="Editar Jogo">
                EDITAR
              </button>

              <button 
                className="fab-sub-button btn-icone" 
                onClick={() => navigate("/adicionar-jogo")}
                title="Adicionar Confronto"
              >
                +
              </button>
            </div>
          )}

          <button 
            className="fab-main-button" 
            onClick={() => setMenuAdminAberto(!menuAdminAberto)}
          >
            {menuAdminAberto ? "✕" : "✏️"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Horarios;