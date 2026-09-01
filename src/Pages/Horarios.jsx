import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Horarios.css";
import { MOCK_JOGOS } from "../utils/mockJogos";

function Horarios() {
  const navigate = useNavigate();
  const [jogos, setJogos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuAdminAberto, setMenuAdminAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [modoFinalizar, setModoFinalizar] = useState(false);

  useEffect(() => {
    // Exibe somente confrontos com status "em espera"
    const jogosEmEspera = MOCK_JOGOS.filter((jogo) => jogo.status === "em espera");
    setJogos(jogosEmEspera);

    const adminLogado = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminLogado);
  }, []);

  const handleCardClick = (jogo) => {
    if (modoEdicao) {
      navigate("/adicionar-jogo", {
        state: { jogoParaEditar: jogo, isEditing: true }
      });
    } else if (modoFinalizar) {
      navigate("/finalizar", {
        state: { jogo }
      });
    }
  };

  const toggleModoEdicao = () => {
    setModoEdicao(!modoEdicao);
    setModoFinalizar(false);
  };

  const toggleModoFinalizar = () => {
    setModoFinalizar(!modoFinalizar);
    setModoEdicao(false);
  };

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">Horários de Início</h1>
        {modoEdicao && (
          <span className="aviso-modo-edicao">Selecione um jogo para editar</span>
        )}
        {modoFinalizar && (
          <span className="aviso-modo-edicao">Selecione um jogo para finalizar</span>
        )}
      </div>

      <div className="lista-confrontos">
        {jogos.length === 0 ? (
          <p className="horarios-mensagem-vazia">Nenhum jogo em espera no momento.</p>
        ) : (
          jogos.map((jogo) => (
            <div
              key={jogo.id}
              className={`card-confronto ${
                modoEdicao || modoFinalizar ? "card-editavel" : ""
              }`}
              onClick={() => handleCardClick(jogo)}
            >
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
          ))
        )}
      </div>

      {isAdmin && (
        <div className="fab-container">
          {menuAdminAberto && (
            <div className="fab-options">
              <button
                className={`fab-sub-button btn-texto ${modoFinalizar ? "ativo" : ""}`}
                title="Finalizar Jogo"
                onClick={toggleModoFinalizar}
              >
                FINALIZAR
              </button>

              <button
                className={`fab-sub-button btn-texto ${modoEdicao ? "ativo" : ""}`}
                title="Editar Jogo"
                onClick={toggleModoEdicao}
              >
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