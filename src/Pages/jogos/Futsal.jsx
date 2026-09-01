import { useState } from "react";
import "../../css/Horarios.css";
import { MOCK_JOGOS } from "../../utils/mockJogos.js";

function Futsal() {
  const [generoFiltro, setGeneroFiltro] = useState("F");

  // Filtra jogos de FUTSAL em espera respeitando o gênero selecionado
  const jogosFutsal = MOCK_JOGOS.filter(
    (jogo) =>
      jogo.modalidade === "FUTSAL" &&
      jogo.status === "em espera" &&
      (!jogo.genero || jogo.genero === generoFiltro)
  );

  // Renderização segura de bandeira (Imagem, Emoji ou Fallback)
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
    return <span className="bandeira">{bandeira || "🇧🇷"}</span>;
  };

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">Horários de Início</h1>
        <h2 className="horarios-subtitulo">FUTSAL</h2>
      </div>

      {/* Visual do botão mantido, com inicialização no Feminino (F) */}
      <div className="filtros-container">
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
      </div>

      {/* Lista de Confrontos */}
      <div className="lista-confrontos">
        {jogosFutsal.length > 0 ? (
          jogosFutsal.map((jogo) => (
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
        ) : (
          <p className="horarios-mensagem-vazia">
            Nenhum jogo de Futsal ({generoFiltro === "M" ? "Masculino" : "Feminino"}) em espera.
          </p>
        )}
      </div>
    </div>
  );
}

export default Futsal;