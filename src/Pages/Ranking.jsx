import { useState } from "react";
import "../css/Ranking.css";
import { MOCK_TIMES } from "../utils/mockTimes.js";

const MODALIDADES = ["QUEIMADO", "FUTSAL", "FUTSETE", "VOLLEI"];

function Ranking() {
  const [modalidade, setModalidade] = useState("QUEIMADO");
  const [generoFiltro, setGeneroFiltro] = useState("M");
  const [menuAberto, setMenuAberto] = useState(false);

  // Filtra times que possuem a modalidade e os ordena por pontos (decrescente)
  const timesFiltrados = Object.values(MOCK_TIMES)
    .filter((time) => time.modalidades?.includes(modalidade))
    .sort((a, b) => (b.pontos || 0) - (a.pontos || 0));

  const primeiro = timesFiltrados[0];
  const segundo = timesFiltrados[1];
  const terceiro = timesFiltrados[2];
  const demaisTimes = timesFiltrados.slice(3);

  const ocultarBotaoGenero = modalidade === "FUTSETE";

  // Helper para renderização segura das bandeiras (Imagem URL ou Emoji)
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
    return <span className="bandeira-emoji">{bandeira || "❓"}</span>;
  };

  return (
    <div className="ranking-page">
      <div className="ranking-container">
        <h1 className="ranking-titulo">RANKING</h1>

        {/* Seletor de Modalidade */}
        <div className="modalidade-selector">
          <button
            className="modalidade-btn"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {modalidade}
            <span className="seta-dropdown">{menuAberto ? "▲" : "▼"}</span>
          </button>

          {menuAberto && (
            <div className="modalidade-dropdown">
              {MODALIDADES.map((mod) => (
                <div
                  key={mod}
                  className={`dropdown-item ${mod === modalidade ? "ativo" : ""}`}
                  onClick={() => {
                    setModalidade(mod);
                    setMenuAberto(false);
                  }}
                >
                  {mod}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filtro Masculino / Feminino */}
        {!ocultarBotaoGenero && (
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
        )}

        {/* Pódio */}
        <div className="podio-container">
          {/* 3º Lugar (Esquerda) */}
          <div className="podio-coluna">
            <div className="bandeira-podio-wrapper">
              {renderBandeira(terceiro)}
            </div>
            <div className="bloco-podio bloco-terceiro">
              <span className="posicao-numero">3</span>
            </div>
          </div>

          {/* 1º Lugar (Centro) */}
          <div className="podio-coluna">
            <div className="bandeira-podio-wrapper">
              {renderBandeira(primeiro)}
            </div>
            <div className="bloco-podio bloco-primeiro">
              <span className="posicao-numero">1</span>
            </div>
          </div>

          {/* 2º Lugar (Direita) */}
          <div className="podio-coluna">
            <div className="bandeira-podio-wrapper">
              {renderBandeira(segundo)}
            </div>
            <div className="bloco-podio bloco-segundo">
              <span className="posicao-numero">2</span>
            </div>
          </div>
        </div>

        {/* Lista de Posições (4º em diante) */}
        <div className="ranking-lista">
          {demaisTimes.length > 0 ? (
            demaisTimes.map((time, idx) => (
              <div key={time.nome} className="card-ranking-item">
                <span className="posicao-lista">{idx + 4}</span>
                <span className="nome-time-lista">{time.nome}</span>
                <div className="bandeira-badge-lista">
                  {renderBandeira(time)}
                </div>
              </div>
            ))
          ) : (
            <p className="mensagem-vazia">Sem mais times para esta modalidade.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ranking;