import { useState } from "react";
import "../css/Ranking.css";
import { MOCK_TIMES } from "../utils/mockTimes.js";

const MODALIDADES = ["QUEIMADO", "FUTSAL", "FUTSETE", "VOLLEI"];

function Ranking() {
  const [modalidade, setModalidade] = useState("QUEIMADO");
  const [menuAberto, setMenuAberto] = useState(false);

  // Filtra times que possuem a modalidade e os ordena por pontos (decrescente)
  const timesFiltrados = Object.values(MOCK_TIMES)
    .filter((time) => time.modalidades.includes(modalidade))
    .sort((a, b) => b.pontos - a.pontos);

  const primeiro = timesFiltrados[0];
  const segundo = timesFiltrados[1];
  const terceiro = timesFiltrados[2];
  const demaisTimes = timesFiltrados.slice(3);

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

        {/* Pódio */}
        <div className="podio-container">
          {/* 3º Lugar (Esquerda) */}
          <div className="podio-coluna">
            <div className="bandeira-podio-wrapper">
              <span className="bandeira-emoji">{terceiro ? terceiro.bandeira : "❓"}</span>
            </div>
            <div className="bloco-podio bloco-terceiro">
              <span className="posicao-numero">3</span>
            </div>
          </div>

          {/* 1º Lugar (Centro) */}
          <div className="podio-coluna">
            <div className="bandeira-podio-wrapper">
              <span className="bandeira-emoji">{primeiro ? primeiro.bandeira : "❓"}</span>
            </div>
            <div className="bloco-podio bloco-primeiro">
              <span className="posicao-numero">1</span>
            </div>
          </div>

          {/* 2º Lugar (Direita) */}
          <div className="podio-coluna">
            <div className="bandeira-podio-wrapper">
              <span className="bandeira-emoji">{segundo ? segundo.bandeira : "❓"}</span>
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
                  <span className="bandeira-emoji">{time.bandeira}</span>
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