import { useState } from "react";
import "../../css/Horarios.css";
import { MOCK_JOGOS } from "../../utils/mockJogos.js";

function Vollei() {
  const [generoFiltro, setGeneroFiltro] = useState("M");

  // Filtra apenas jogos de VOLLEI em espera e do gênero selecionado
  const jogosVollei = MOCK_JOGOS.filter(
    (jogo) =>
      jogo.modalidade === "VOLLEI" &&
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
        <h2 className="horarios-subtitulo">VÔLEI</h2>
      </div>

      {/* Filtro Masculino / Feminino */}
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
        {jogosVollei.length > 0 ? (
          jogosVollei.map((jogo) => (
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
            Nenhum jogo de Vôlei ({generoFiltro === "M" ? "Masculino" : "Feminino"}) em espera.
          </p>
        )}
      </div>
    </div>
  );
}

export default Vollei;