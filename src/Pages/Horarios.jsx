import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Horarios.css";
import { MOCK_JOGOS } from "../utils/mockJogos";

function Horarios() {
  const navigate = useNavigate();
  const [generoFiltro, setGeneroFiltro] = useState("M");
  const [modalidadeFiltro, setModalidadeFiltro] = useState("TODAS");

  // Filtra os jogos respeitando a regra de ocultar gênero em FUTSETE/FUTSAL
  const jogosFiltrados = MOCK_JOGOS.filter((jogo) => {
    if (jogo.status !== "em espera") return false;

    // Filtro por Modalidade
    if (modalidadeFiltro !== "TODAS" && jogo.modalidade !== modalidadeFiltro) {
      return false;
    }

    // Modalidades isentas do filtro de gênero
    const isIsentoGenero = jogo.modalidade === "FUTSETE" || jogo.modalidade === "FUTSAL";

    // Se não for isento, exige correspondência de gênero
    if (!isIsentoGenero && jogo.genero !== generoFiltro) {
      return false;
    }

    return true;
  });

  const ocultarBotaoGenero = modalidadeFiltro === "FUTSETE" || modalidadeFiltro === "FUTSAL";

  // Helper para renderizar bandeiras em URL (imagem) ou Emoji com fallback seguro
  const renderBandeira = (time) => {
    const bandeira = time?.bandeira;
    if (bandeira?.startsWith("http")) {
      return (
        <img
          src={bandeira}
          alt={time?.nome || "Time"}
          className="bandeira-img"
        />
      );
    }
    return <span className="bandeira">{bandeira || "🏳️"}</span>;
  };

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">Horários de Início</h1>
      </div>

      {/* Barra de Filtros */}
      <div className="filtros-container">
        {!ocultarBotaoGenero && (
          <div className="toggle-genero-container">
            <button
              className={`btn-genero ${generoFiltro === "M" ? "ativo" : ""}`}
              onClick={() => setGeneroFiltro("M")}
            >
              M
            </button>
            <button
              className={`btn-genero ${generoFiltro === "F" ? "ativo" : ""}`}
              onClick={() => setGeneroFiltro("F")}
            >
              F
            </button>
          </div>
        )}
      </div>

      {/* Lista de Confrontos */}
      <div className="lista-confrontos">
        {jogosFiltrados.length === 0 ? (
          <p className="horarios-mensagem-vazia">Nenhum jogo encontrado.</p>
        ) : (
          jogosFiltrados.map((jogo) => (
            <div key={jogo.id} className="card-confronto">
              <span className="modalidade-titulo">{jogo.modalidade}</span>
              <div className="conteudo-confronto">
                <div className="time-box">
                  {renderBandeira(jogo.timeA)}
                  <span className="nome-time">{jogo.timeA?.nome || "Time A"}</span>
                </div>
                <div className="horario-pill">{jogo.horario}</div>
                <div className="time-box">
                  {renderBandeira(jogo.timeB)}
                  <span className="nome-time">{jogo.timeB?.nome || "Time B"}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Horarios;