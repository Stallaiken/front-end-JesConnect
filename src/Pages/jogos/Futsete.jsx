import { useState } from "react";
import "../../css/Horarios.css";
import { MOCK_JOGOS } from "../../utils/mockJogos.js";

function Futsete() {
  // Filtra apenas jogos de FUTSETE em espera
  const jogosFutsete = MOCK_JOGOS.filter(
    (jogo) => jogo.modalidade === "FUTSETE" && jogo.status === "em espera"
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
        <h2 className="horarios-subtitulo">FUTSETE</h2>
      </div>

      {/* Lista de Confrontos */}
      <div className="lista-confrontos">
        {jogosFutsete.length > 0 ? (
          jogosFutsete.map((jogo) => (
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
          <p className="horarios-mensagem-vazia">Nenhum jogo de Futsete em espera.</p>
        )}
      </div>
    </div>
  );
}

export default Futsete;